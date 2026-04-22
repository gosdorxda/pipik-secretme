import { Router } from "express";
import {
  db,
  usersTable,
  messagesTable,
  transactionsTable,
  systemSettingsTable,
  SETTING_KEYS,
  redeemRequestsTable,
} from "@workspace/db";
import { eq, desc, ilike, or, count, sum, sql, and } from "drizzle-orm";
import { requireAdmin } from "../middlewares/requireAdmin";
import { getBannedIps, invalidateCache } from "../lib/settingsCache";
import { IS_SANDBOX } from "../lib/tripay";
import { getLogs } from "../lib/logBuffer";
import { createClerkClient, getAuth } from "@clerk/express";
import { ObjectStorageService } from "../lib/objectStorage";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const objectStorageService = new ObjectStorageService();

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/x-icon",
  "image/vnd.microsoft.icon",
]);
const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

const router = Router();

router.use(requireAdmin);

router.get("/stats", async (req, res) => {
  try {
    const [
      totalUsersResult,
      premiumUsersResult,
      totalMessagesResult,
      totalTransactionsResult,
      revenueResult,
    ] = await Promise.all([
      db.select({ count: count() }).from(usersTable),
      db
        .select({ count: count() })
        .from(usersTable)
        .where(eq(usersTable.isPremium, true)),
      db.select({ count: count() }).from(messagesTable),
      db
        .select({ count: count() })
        .from(transactionsTable)
        .where(eq(transactionsTable.status, "PAID")),
      db
        .select({ total: sum(transactionsTable.amount) })
        .from(transactionsTable)
        .where(eq(transactionsTable.status, "PAID")),
    ]);

    res.json({
      totalUsers: totalUsersResult[0]?.count ?? 0,
      premiumUsers: premiumUsersResult[0]?.count ?? 0,
      totalMessages: totalMessagesResult[0]?.count ?? 0,
      totalTransactions: totalTransactionsResult[0]?.count ?? 0,
      totalRevenue: Number(revenueResult[0]?.total ?? 0),
    });
  } catch (err) {
    req.log.error({ err }, "Error getting admin stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/users", async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
  const search = (req.query.search as string | undefined)?.trim();
  const offset = (page - 1) * limit;

  try {
    const whereClause = search
      ? or(
          ilike(usersTable.username, `%${search}%`),
          ilike(usersTable.displayName, `%${search}%`),
        )
      : undefined;

    const [users, totalResult] = await Promise.all([
      db
        .select({
          id: usersTable.id,
          clerkId: usersTable.clerkId,
          username: usersTable.username,
          displayName: usersTable.displayName,
          avatarUrl: usersTable.avatarUrl,
          isPremium: usersTable.isPremium,
          isAdmin: usersTable.isAdmin,
          points: usersTable.points,
          linkOpens: usersTable.linkOpens,
          emailNotifications: usersTable.emailNotifications,
          createdAt: usersTable.createdAt,
        })
        .from(usersTable)
        .where(whereClause)
        .orderBy(desc(usersTable.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: count() }).from(usersTable).where(whereClause),
    ]);

    // Fetch emails from Clerk in batch
    const emailMap = new Map<string, string>();
    const clerkIds = users.map((u) => u.clerkId).filter(Boolean) as string[];
    if (clerkIds.length > 0) {
      try {
        const clerkRes = await clerkClient.users.getUserList({
          userId: clerkIds,
          limit: clerkIds.length,
        });
        for (const cu of clerkRes.data) {
          const primary =
            cu.emailAddresses.find((e) => e.id === cu.primaryEmailAddressId)
              ?.emailAddress ?? cu.emailAddresses[0]?.emailAddress;
          if (primary) emailMap.set(cu.id, primary);
        }
      } catch (clerkErr) {
        req.log.warn({ clerkErr }, "Failed to fetch user emails from Clerk");
      }
    }

    const usersWithEmail = users.map((u) => ({
      ...u,
      email: u.clerkId ? (emailMap.get(u.clerkId) ?? null) : null,
    }));

    res.json({
      users: usersWithEmail,
      total: totalResult[0]?.count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((totalResult[0]?.count ?? 0) / limit),
    });
  } catch (err) {
    req.log.error({ err }, "Error listing users");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { isPremium, isAdmin, points } = req.body;

  const updates: Record<string, any> = { updatedAt: new Date() };
  if (typeof isPremium === "boolean") updates.isPremium = isPremium;
  if (typeof isAdmin === "boolean") updates.isAdmin = isAdmin;
  if (typeof points === "number" && points >= 0) updates.points = points;

  if (Object.keys(updates).length === 1) {
    res.status(400).json({ error: "No valid fields to update" });
    return;
  }

  try {
    const [updated] = await db
      .update(usersTable)
      .set(updates)
      .where(eq(usersTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Error updating user");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  const callerClerkId = getAuth(req).userId ?? null;
  try {
    const [targetUser] = await db
      .select({ id: usersTable.id, clerkId: usersTable.clerkId })
      .from(usersTable)
      .where(eq(usersTable.id, id));

    if (!targetUser) {
      res.status(404).json({ error: "User tidak ditemukan" });
      return;
    }

    if (
      callerClerkId &&
      targetUser.clerkId &&
      targetUser.clerkId === callerClerkId
    ) {
      res
        .status(400)
        .json({ error: "Kamu tidak dapat menghapus akunmu sendiri." });
      return;
    }

    const [deleted] = await db
      .delete(usersTable)
      .where(eq(usersTable.id, id))
      .returning({ id: usersTable.id, clerkId: usersTable.clerkId });

    if (!deleted) {
      res.status(404).json({ error: "User tidak ditemukan" });
      return;
    }
    if (deleted.clerkId) {
      try {
        await clerkClient.users.deleteUser(deleted.clerkId);
      } catch (clerkErr) {
        req.log.warn({ clerkErr }, "Failed to delete Clerk user, skipping");
      }
    }
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Error deleting user");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/stats/daily", async (req, res) => {
  try {
    const [dailyRegistrations, dailyRevenue] = await Promise.all([
      db.execute(sql`
        SELECT
          DATE(created_at AT TIME ZONE 'Asia/Jakarta') AS day,
          COUNT(*)::int AS count
        FROM users
        WHERE created_at >= NOW() - INTERVAL '7 days'
        GROUP BY day
        ORDER BY day ASC
      `),
      db.execute(sql`
        SELECT
          DATE(paid_at AT TIME ZONE 'Asia/Jakarta') AS day,
          SUM(amount)::bigint AS total
        FROM transactions
        WHERE status = 'PAID' AND paid_at >= NOW() - INTERVAL '7 days'
        GROUP BY day
        ORDER BY day ASC
      `),
    ]);

    const days: string[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }

    const regMap = new Map<string, number>();
    for (const row of dailyRegistrations.rows as any[]) {
      regMap.set(String(row.day).slice(0, 10), Number(row.count));
    }
    const revMap = new Map<string, number>();
    for (const row of dailyRevenue.rows as any[]) {
      revMap.set(String(row.day).slice(0, 10), Number(row.total));
    }

    const registrations = days.map((d) => ({
      day: d,
      count: regMap.get(d) ?? 0,
    }));
    const revenue = days.map((d) => ({
      day: d,
      total: revMap.get(d) ?? 0,
    }));

    res.json({ registrations, revenue });
  } catch (err) {
    req.log.error({ err }, "Error getting daily stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/users/:id/premium", async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await db
      .update(usersTable)
      .set({ isPremium: false, updatedAt: new Date() })
      .where(eq(usersTable.id, id))
      .returning({ id: usersTable.id });
    if (!updated) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/transactions", async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
  const offset = (page - 1) * limit;

  try {
    const [transactions, totalResult] = await Promise.all([
      db
        .select({
          id: transactionsTable.id,
          userId: transactionsTable.userId,
          merchantRef: transactionsTable.merchantRef,
          tripayRef: transactionsTable.tripayRef,
          amount: transactionsTable.amount,
          status: transactionsTable.status,
          paidAt: transactionsTable.paidAt,
          createdAt: transactionsTable.createdAt,
          username: usersTable.username,
          displayName: usersTable.displayName,
        })
        .from(transactionsTable)
        .leftJoin(usersTable, eq(transactionsTable.userId, usersTable.id))
        .orderBy(desc(transactionsTable.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: count() }).from(transactionsTable),
    ]);

    res.json({
      transactions,
      total: totalResult[0]?.count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((totalResult[0]?.count ?? 0) / limit),
    });
  } catch (err) {
    req.log.error({ err }, "Error listing transactions");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/settings", async (req, res) => {
  try {
    const rows = await db.select().from(systemSettingsTable);
    const settings: Record<string, string | null> = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }

    const defaults: Record<string, string> = {
      [SETTING_KEYS.PREMIUM_PRICE]: process.env.PREMIUM_PRICE || "49900",
      [SETTING_KEYS.REFERRAL_SIGNUP_POINTS]: "10",
      [SETTING_KEYS.REFERRAL_UPGRADE_POINTS]: "100",
      [SETTING_KEYS.MAINTENANCE_MODE]: "false",
      [SETTING_KEYS.APP_NAME]: "WhisperBox",
      [SETTING_KEYS.APP_DESCRIPTION]: "Terima pesan anonim dari siapa saja",
      [SETTING_KEYS.RESEND_FROM_EMAIL]: process.env.RESEND_FROM_EMAIL || "",
      [SETTING_KEYS.TRIPAY_MERCHANT_CODE]:
        process.env.TRIPAY_MERCHANT_CODE || "",
      [SETTING_KEYS.EMAIL_NEW_MSG_SUBJECT]:
        "📬 Kamu punya pesan anonim baru di {{appName}}",
      [SETTING_KEYS.EMAIL_NEW_MSG_INTRO]:
        "Hei {{name}}, seseorang mengirim pesan anonim kepadamu di {{appName}}.",
      [SETTING_KEYS.EMAIL_REPLY_SUBJECT]:
        "💬 @{{ownerUsername}} membalas pesanmu di {{appName}}",
      [SETTING_KEYS.EMAIL_REPLY_INTRO]:
        "<strong>@{{ownerUsername}}</strong> membalas pesan anonim yang kamu kirim di {{appName}}.",
      link_opens_points_per_1000: "1",
      point_redeem_rate: "10000",
      banned_ips: "[]",
      message_rate_limit_count: "5",
      message_rate_limit_window_minutes: "10",
      notification_active: "false",
      notification_message: "",
      notification_type: "info",
      [SETTING_KEYS.SITE_LOGO_URL]: "",
      [SETTING_KEYS.SITE_FAVICON_URL]: "",
      [SETTING_KEYS.GOOGLE_ANALYTICS_ID]: "",
      [SETTING_KEYS.BANNER_AD_ACTIVE]: "false",
      [SETTING_KEYS.BANNER_AD_IMAGE_URL]: "",
      [SETTING_KEYS.BANNER_AD_LINK_URL]: "",
      [SETTING_KEYS.BANNER_AD_ALT]: "",
    };

    for (const [key, val] of Object.entries(defaults)) {
      if (!(key in settings)) settings[key] = val;
    }

    // Inject runtime-only values
    settings._tripay_sandbox = IS_SANDBOX ? "true" : "false";

    res.json(settings);
  } catch (err) {
    req.log.error({ err }, "Error getting settings");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/settings", async (req, res) => {
  const updates: Record<string, string> = req.body;
  if (!updates || typeof updates !== "object") {
    res.status(400).json({ error: "Invalid body" });
    return;
  }

  if ("app_name" in updates) {
    const name = String(updates.app_name).trim();
    if (!name) {
      res.status(400).json({ error: "Nama Aplikasi tidak boleh kosong." });
      return;
    }
    if (name.length > 50) {
      res.status(400).json({ error: "Nama Aplikasi maksimal 50 karakter." });
      return;
    }
    updates.app_name = name;
  }

  try {
    const now = new Date();
    const rows = Object.entries(updates).map(([key, value]) => ({
      key,
      value: String(value),
      updatedAt: now,
    }));

    for (const row of rows) {
      await db
        .insert(systemSettingsTable)
        .values(row)
        .onConflictDoUpdate({
          target: systemSettingsTable.key,
          set: { value: row.value, updatedAt: now },
        });
    }

    invalidateCache();
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Error updating settings");
    res.status(500).json({ error: "Internal server error" });
  }
});

// IP Ban routes
router.get("/ip-bans", async (req, res) => {
  try {
    const ips = await getBannedIps();
    res.json({ ips });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/ip-bans", async (req, res) => {
  const { ip } = req.body;
  if (!ip || typeof ip !== "string" || !/^[\d.:a-fA-F]+$/.test(ip.trim())) {
    res.status(400).json({ error: "Invalid IP address" });
    return;
  }
  try {
    const ips = await getBannedIps();
    const trimmed = ip.trim();
    if (!ips.includes(trimmed)) {
      ips.push(trimmed);
      const now = new Date();
      await db
        .insert(systemSettingsTable)
        .values({
          key: "banned_ips",
          value: JSON.stringify(ips),
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: systemSettingsTable.key,
          set: { value: JSON.stringify(ips), updatedAt: now },
        });
      invalidateCache();
    }
    res.json({ ips });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/ip-bans/:ip", async (req, res) => {
  const ip = decodeURIComponent(req.params.ip);
  try {
    const ips = await getBannedIps();
    const filtered = ips.filter((i) => i !== ip);
    const now = new Date();
    await db
      .insert(systemSettingsTable)
      .values({
        key: "banned_ips",
        value: JSON.stringify(filtered),
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: systemSettingsTable.key,
        set: { value: JSON.stringify(filtered), updatedAt: now },
      });
    invalidateCache();
    res.json({ ips: filtered });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/redeem-requests", async (req, res) => {
  try {
    const status = req.query.status as string | undefined;
    const rows = await db
      .select({
        id: redeemRequestsTable.id,
        userId: redeemRequestsTable.userId,
        points: redeemRequestsTable.points,
        paymentInfo: redeemRequestsTable.paymentInfo,
        status: redeemRequestsTable.status,
        createdAt: redeemRequestsTable.createdAt,
        updatedAt: redeemRequestsTable.updatedAt,
        username: usersTable.username,
        displayName: usersTable.displayName,
      })
      .from(redeemRequestsTable)
      .leftJoin(usersTable, eq(redeemRequestsTable.userId, usersTable.id))
      .where(status ? eq(redeemRequestsTable.status, status) : undefined)
      .orderBy(desc(redeemRequestsTable.createdAt));

    res.json({ requests: rows });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/redeem-requests/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body ?? {};
  if (!["pending", "success", "rejected"].includes(status)) {
    res.status(400).json({ error: "Status tidak valid." });
    return;
  }
  try {
    const existing = await db.query.redeemRequestsTable.findFirst({
      where: eq(redeemRequestsTable.id, id),
    });
    if (!existing) {
      res.status(404).json({ error: "Request tidak ditemukan." });
      return;
    }

    const [updated] = await db
      .update(redeemRequestsTable)
      .set({ status, updatedAt: new Date() })
      .where(eq(redeemRequestsTable.id, id))
      .returning();

    if (status === "rejected" && existing.status !== "rejected") {
      await db
        .update(usersTable)
        .set({
          redeemedPoints: sql`GREATEST(0, ${usersTable.redeemedPoints} - ${existing.points})`,
        })
        .where(eq(usersTable.id, existing.userId));
    }

    res.json({ request: updated });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/logs", (req, res) => {
  const limit = Math.min(200, Math.max(1, Number(req.query.limit) || 100));
  res.json({ logs: getLogs(limit) });
});

router.post("/upload-url", async (req, res) => {
  const { contentType, size } = req.body ?? {};
  if (!contentType || typeof contentType !== "string") {
    res.status(400).json({ error: "contentType diperlukan" });
    return;
  }
  if (!ALLOWED_IMAGE_TYPES.has(contentType)) {
    res.status(400).json({ error: "Hanya file gambar yang diizinkan" });
    return;
  }
  if (typeof size === "number" && size > MAX_UPLOAD_SIZE_BYTES) {
    res.status(400).json({ error: "Ukuran file melebihi batas 5 MB" });
    return;
  }
  try {
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    const objectPath =
      objectStorageService.normalizeObjectEntityPath(uploadURL);
    res.json({ uploadURL, objectPath });
  } catch (err) {
    req.log.error({ err }, "Error generating admin upload URL");
    res.status(500).json({ error: "Gagal membuat URL upload" });
  }
});

router.get("/messages", async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 25));
  const search = (req.query.search as string | undefined)?.trim();
  const offset = (page - 1) * limit;

  try {
    const whereClause = search
      ? or(
          ilike(messagesTable.content, `%${search}%`),
          ilike(usersTable.username, `%${search}%`),
          ilike(usersTable.displayName, `%${search}%`),
        )
      : undefined;

    const [messages, totalResult] = await Promise.all([
      db
        .select({
          id: messagesTable.id,
          content: messagesTable.content,
          isRead: messagesTable.isRead,
          isPublic: messagesTable.isPublic,
          ownerReply: messagesTable.ownerReply,
          senderEmail: messagesTable.senderEmail,
          createdAt: messagesTable.createdAt,
          recipientUsername: usersTable.username,
          recipientDisplayName: usersTable.displayName,
        })
        .from(messagesTable)
        .innerJoin(usersTable, eq(messagesTable.recipientId, usersTable.id))
        .where(whereClause)
        .orderBy(desc(messagesTable.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(messagesTable)
        .innerJoin(usersTable, eq(messagesTable.recipientId, usersTable.id))
        .where(whereClause),
    ]);

    res.json({
      messages,
      total: totalResult[0]?.count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((totalResult[0]?.count ?? 0) / limit),
    });
  } catch (err) {
    req.log.error({ err }, "Error listing messages");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
