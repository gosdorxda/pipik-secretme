import { Router } from "express";
import { db, usersTable, transactionsTable, referralsTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import {
  createQrisTransaction,
  generateMerchantRef,
  getTransactionDetail,
  verifyCallbackSignature,
  sanitizeStatus,
} from "../lib/tripay";
import { getSetting } from "../lib/settingsCache";
import { createClerkClient } from "@clerk/express";

const router = Router();
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

const appUrl = process.env.APP_URL || `https://${process.env.REPLIT_DEV_DOMAIN}`;
const callbackUrl = `${appUrl}/api/payments/callback`;

async function awardUpgradeBonus(upgradedUserId: string) {
  const referral = await db.query.referralsTable.findFirst({
    where: eq(referralsTable.referredUserId, upgradedUserId),
  });
  if (!referral || referral.upgradeBonusAwarded) return;

  const referrer = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, referral.referrerId),
  });
  if (!referrer) return;

  const bonusRaw = await getSetting("referral_upgrade_points", "100");
  const bonus = parseInt(bonusRaw, 10) || 100;

  await db.update(usersTable)
    .set({ points: sql`${usersTable.points} + ${bonus}` })
    .where(eq(usersTable.id, referrer.id));
  await db.update(referralsTable)
    .set({ upgradeBonusAwarded: true })
    .where(eq(referralsTable.id, referral.id));
}

async function upgradeToPremium(userId: string, merchantRef: string, paidAt: Date | null) {
  await db.update(transactionsTable)
    .set({ status: "PAID", paidAt: paidAt ?? new Date() })
    .where(eq(transactionsTable.merchantRef, merchantRef));
  await db.update(usersTable)
    .set({ isPremium: true, updatedAt: new Date() })
    .where(eq(usersTable.id, userId));
  await awardUpgradeBonus(userId);
}

router.post("/create", requireAuth, async (req, res) => {
  const clerkUserId = (req as any).clerkUserId as string;
  try {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.clerkId, clerkUserId),
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    if (user.isPremium) {
      res.status(400).json({ error: "already_premium" });
      return;
    }

    const existing = await db.query.transactionsTable.findFirst({
      where: eq(transactionsTable.userId, user.id),
      orderBy: [desc(transactionsTable.createdAt)],
    });

    if (existing && existing.tripayRef) {
      const detail = await getTransactionDetail(existing.tripayRef).catch(() => null);
      if (detail) {
        if (detail.status === "PAID") {
          await upgradeToPremium(user.id, existing.merchantRef, detail.paidAt);
          res.status(400).json({ error: "already_premium" });
          return;
        }
        const nowSec = Math.floor(Date.now() / 1000);
        const isExpiredByTime = detail.expiresAt != null && detail.expiresAt < nowSec;
        if (detail.status === "UNPAID" && !isExpiredByTime && (detail.qrString || detail.qrUrl)) {
          res.json({
            merchantRef: existing.merchantRef,
            tripayRef: existing.tripayRef,
            amount: existing.amount,
            qrString: detail.qrString,
            qrImageUrl: detail.qrUrl,
            expiresAt: detail.expiresAt,
          });
          return;
        }
        // EXPIRED / FAILED or past expiresAt — mark old record and fall through to create new
        const closedStatus = isExpiredByTime ? "EXPIRED" : sanitizeStatus(detail.status);
        if (closedStatus !== existing.status) {
          await db.update(transactionsTable)
            .set({ status: closedStatus })
            .where(eq(transactionsTable.merchantRef, existing.merchantRef));
        }
      }
    }

    let customerName = user.displayName || user.username;
    let customerEmail = "user@whisperbox.io";
    try {
      const clerkUser = await clerkClient.users.getUser(clerkUserId);
      const primaryEmail = clerkUser.emailAddresses.find(
        (e) => e.id === clerkUser.primaryEmailAddressId
      )?.emailAddress;
      if (primaryEmail) customerEmail = primaryEmail;
      const fullName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ");
      if (fullName) customerName = fullName;
    } catch {
      // Use fallback values
    }

    const merchantRef = generateMerchantRef(user.id);

    const premiumAmountRaw = await getSetting("premium_price", "49900");
    const premiumAmount = parseInt(premiumAmountRaw, 10) || 49900;

    const tripay = await createQrisTransaction({
      merchantRef,
      amount: premiumAmount,
      customerName,
      customerEmail,
      callbackUrl,
    });

    await db.insert(transactionsTable).values({
      userId: user.id,
      tripayRef: tripay.tripayRef,
      merchantRef,
      amount: premiumAmount,
      status: "UNPAID",
    });

    res.json({
      merchantRef,
      tripayRef: tripay.tripayRef,
      amount: premiumAmount,
      qrString: tripay.qrString,
      qrImageUrl: tripay.qrUrl,
      expiresAt: tripay.expiresAt,
    });
  } catch (err: any) {
    req.log.error({ err }, "Error creating payment");
    res.status(503).json({ error: "payment_service_error", message: err.message });
  }
});

router.get("/status/:ref", requireAuth, async (req, res) => {
  const clerkUserId = (req as any).clerkUserId as string;
  const ref = req.params.ref as string;
  try {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.clerkId, clerkUserId),
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (user.isPremium) {
      res.json({ status: "PAID", isPremium: true, paidAt: null });
      return;
    }

    const tx = await db.query.transactionsTable.findFirst({
      where: eq(transactionsTable.merchantRef, ref),
    });
    if (!tx || tx.userId !== user.id) {
      res.status(404).json({ error: "Transaction not found" });
      return;
    }

    if (tx.status === "PAID") {
      res.json({ status: "PAID", isPremium: true, paidAt: tx.paidAt });
      return;
    }

    let remoteStatus = tx.status;
    let paidAt: Date | null = null;
    if (tx.tripayRef) {
      try {
        const detail = await getTransactionDetail(tx.tripayRef);
        remoteStatus = detail.status;
        paidAt = detail.paidAt;
      } catch {
        // Use cached status
      }
    }

    if (remoteStatus === "PAID") {
      await upgradeToPremium(user.id, ref, paidAt);
      res.json({ status: "PAID", isPremium: true, paidAt });
      return;
    }

    if (remoteStatus !== tx.status) {
      await db.update(transactionsTable)
        .set({ status: sanitizeStatus(remoteStatus) })
        .where(eq(transactionsTable.merchantRef, ref));
    }

    res.json({ status: remoteStatus, isPremium: false, paidAt: null });
  } catch (err) {
    req.log.error({ err }, "Error checking payment status");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/callback", async (req, res) => {
  const rawBody: Buffer = (req as any).rawBody;
  const signature = req.headers["x-callback-signature"] as string || "";

  const rawBodyStr = rawBody ? rawBody.toString("utf8") : JSON.stringify(req.body);

  if (!verifyCallbackSignature(rawBodyStr, signature)) {
    res.status(400).json({ success: false, message: "Invalid signature" });
    return;
  }

  try {
    const body = req.body as any;
    const merchantRef = body.merchant_ref as string;
    const status = sanitizeStatus(body.status as string);
    const paidAt = body.paid_at ? new Date(body.paid_at * 1000) : null;

    const tx = await db.query.transactionsTable.findFirst({
      where: eq(transactionsTable.merchantRef, merchantRef),
    });

    if (!tx) {
      res.json({ success: false, message: "Transaction not found" });
      return;
    }

    await db.update(transactionsTable)
      .set({
        status,
        tripayRef: body.reference || tx.tripayRef,
        paidAt: status === "PAID" ? (paidAt ?? new Date()) : tx.paidAt,
      })
      .where(eq(transactionsTable.merchantRef, merchantRef));

    if (status === "PAID") {
      await db.update(usersTable)
        .set({ isPremium: true, updatedAt: new Date() })
        .where(eq(usersTable.id, tx.userId));
      await awardUpgradeBonus(tx.userId);
    }

    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Error processing callback");
    res.status(500).json({ success: false });
  }
});

export default router;
