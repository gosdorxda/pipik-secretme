import { Router } from "express";
import { db, usersTable, referralsTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { getSetting } from "../lib/settingsCache";

const router = Router();

function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

async function ensureReferralCode(userId: string): Promise<string> {
  const user = await db.query.usersTable.findFirst({ where: eq(usersTable.id, userId) });
  if (!user) throw new Error("User not found");
  if (user.referralCode) return user.referralCode;

  let code: string;
  let attempts = 0;
  do {
    code = generateReferralCode();
    attempts++;
    if (attempts > 10) throw new Error("Could not generate unique code");
    const existing = await db.query.usersTable.findFirst({ where: eq(usersTable.referralCode, code) });
    if (!existing) break;
  } while (true);

  await db.update(usersTable).set({ referralCode: code }).where(eq(usersTable.id, userId));
  return code;
}

router.get("/me", requireAuth, async (req, res) => {
  const clerkUserId = req.clerkUserId;
  try {
    const user = await db.query.usersTable.findFirst({ where: eq(usersTable.clerkId, clerkUserId) });
    if (!user) { res.status(404).json({ error: "User not found" }); return; }

    const code = await ensureReferralCode(user.id);

    const referralsList = await db.query.referralsTable.findMany({
      where: eq(referralsTable.referrerId, user.id),
      orderBy: [desc(referralsTable.createdAt)],
    });

    const referredUsers = referralsList.length > 0
      ? await Promise.all(
          referralsList.map(async (r) => {
            const referred = await db.query.usersTable.findFirst({ where: eq(usersTable.id, r.referredUserId) });
            return {
              username: referred?.username ?? "unknown",
              displayName: referred?.displayName ?? null,
              joinedAt: r.createdAt,
              points: r.pointsAwarded,
              upgradeBonusAwarded: r.upgradeBonusAwarded,
              isPremium: referred?.isPremium ?? false,
            };
          })
        )
      : [];

    const pointsPerThousand = parseInt(await getSetting("link_opens_points_per_1000", "1"), 10) || 1;
    const pointsFromReferrals = user.points;
    const pointsFromLinkOpens = Math.floor(user.linkOpens / 1000) * pointsPerThousand;
    const totalPoints = pointsFromReferrals + pointsFromLinkOpens;
    const redeemedPoints = user.redeemedPoints ?? 0;
    const availablePoints = Math.max(0, totalPoints - redeemedPoints);

    res.json({
      referralCode: code,
      points: user.points,
      pointsFromLinkOpens,
      totalPoints,
      availablePoints,
      redeemedPoints,
      linkOpens: user.linkOpens,
      referralCount: referralsList.length,
      referrals: referredUsers,
    });
  } catch (err) {
    req.log.error({ err }, "Error getting referral stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/claim", requireAuth, async (req, res) => {
  const clerkUserId = req.clerkUserId;
  const { referralCode } = req.body ?? {};
  if (!referralCode || typeof referralCode !== "string") {
    res.status(400).json({ error: "referralCode is required" });
    return;
  }
  try {
    const claimant = await db.query.usersTable.findFirst({ where: eq(usersTable.clerkId, clerkUserId) });
    if (!claimant) { res.status(404).json({ error: "User not found" }); return; }

    const referrer = await db.query.usersTable.findFirst({ where: eq(usersTable.referralCode, referralCode) });
    if (!referrer) { res.status(404).json({ error: "Referral code not found" }); return; }
    if (referrer.id === claimant.id) { res.status(400).json({ error: "Cannot refer yourself" }); return; }

    const existing = await db.query.referralsTable.findFirst({ where: eq(referralsTable.referredUserId, claimant.id) });
    if (existing) { res.status(409).json({ error: "Already claimed" }); return; }

    const pointsRaw = await getSetting("referral_signup_points", "10");
    const POINTS = parseInt(pointsRaw, 10) || 10;
    await db.insert(referralsTable).values({
      referrerId: referrer.id,
      referredUserId: claimant.id,
      pointsAwarded: POINTS,
    });
    await db.update(usersTable)
      .set({ points: sql`${usersTable.points} + ${POINTS}` })
      .where(eq(usersTable.id, referrer.id));

    res.json({ success: true, pointsAwarded: POINTS });
  } catch (err) {
    req.log.error({ err }, "Error claiming referral");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
