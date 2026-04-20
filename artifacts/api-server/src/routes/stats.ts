import { Router } from "express";
import { db, usersTable, messagesTable } from "@workspace/db";
import { count } from "drizzle-orm";

const router = Router();

router.get("/stats", async (req, res) => {
  try {
    const [usersResult, messagesResult] = await Promise.all([
      db.select({ count: count() }).from(usersTable),
      db.select({ count: count() }).from(messagesTable),
    ]);

    res.json({
      totalUsers: usersResult[0]?.count ?? 0,
      totalMessages: messagesResult[0]?.count ?? 0,
    });
  } catch (err) {
    req.log.error({ err }, "Error getting public stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
