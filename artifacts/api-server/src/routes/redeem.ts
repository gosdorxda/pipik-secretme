import { Router } from "express";
import { db, usersTable, redeemRequestsTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { getSetting } from "../lib/settingsCache";

const router = Router();

router.get("/me", requireAuth, async (req, res) => {
  const clerkUserId = req.clerkUserId;
  try {
    const user = await db.query.usersTable.findFirst({ where: eq(usersTable.clerkId, clerkUserId) });
    if (!user) { res.status(404).json({ error: "User not found" }); return; }

    const requests = await db.query.redeemRequestsTable.findMany({
      where: eq(redeemRequestsTable.userId, user.id),
      orderBy: [desc(redeemRequestsTable.createdAt)],
    });

    res.json({ requests });
  } catch (err) {
    req.log.error({ err }, "Error fetching redeem requests");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  const clerkUserId = req.clerkUserId;
  const { points, paymentInfo } = req.body ?? {};

  if (!Number.isInteger(points) || points < 1000) {
    res.status(400).json({ error: "Minimal penukaran adalah 1.000 poin." });
    return;
  }
  if (!paymentInfo || typeof paymentInfo !== "string" || !paymentInfo.trim()) {
    res.status(400).json({ error: "Info pembayaran harus diisi." });
    return;
  }

  try {
    const user = await db.query.usersTable.findFirst({ where: eq(usersTable.clerkId, clerkUserId) });
    if (!user) { res.status(404).json({ error: "User not found" }); return; }

    const pointsPerThousand = parseInt(await getSetting("link_opens_points_per_1000", "1"), 10) || 1;
    const totalEarned = user.points + Math.floor(user.linkOpens / 1000) * pointsPerThousand;
    const availablePoints = totalEarned - (user.redeemedPoints ?? 0);

    if (availablePoints < points) {
      res.status(400).json({ error: `Poin tidak cukup. Poin tersedia: ${availablePoints}.` });
      return;
    }

    await db.update(usersTable)
      .set({ redeemedPoints: sql`${usersTable.redeemedPoints} + ${points}` })
      .where(eq(usersTable.id, user.id));

    const [request] = await db.insert(redeemRequestsTable).values({
      userId: user.id,
      points,
      paymentInfo: paymentInfo.trim(),
      status: "pending",
    }).returning();

    res.status(201).json({ request });
  } catch (err) {
    req.log.error({ err }, "Error creating redeem request");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
