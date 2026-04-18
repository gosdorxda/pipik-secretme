import { Router } from "express";
import { createHash } from "crypto";
import { db, usersTable, messagesTable, campaignsTable } from "@workspace/db";
import { eq, desc, count, and, isNull, gte, lt, inArray } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { createClerkClient } from "@clerk/express";
import { sendNewMessageNotification, sendReplyNotification } from "../lib/email";
import { getSetting } from "../lib/settingsCache";

import {
  SendMessageParams,
  SendMessageBody,
  GetMyMessagesQueryParams,
  DeleteMessageParams,
  ReplyToMessageParams,
  ReplyToMessageBody,
  ToggleMessageVisibilityParams,
  ToggleMessageVisibilityBody,
} from "@workspace/api-zod";

// In-memory rate limiter: ipHash -> array of send timestamps
const rateLimitMap = new Map<string, number[]>();

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

const router = Router();

router.get("/stats/me", requireAuth, async (req, res) => {
  const clerkUserId = req.clerkUserId;
  try {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.clerkId, clerkUserId),
    });
    if (!user) {
      res.json({ totalMessages: 0, unreadMessages: 0, unrepliedMessages: 0, linkOpens: 0, isPremium: false });
      return;
    }
    const [totalResult] = await db
      .select({ value: count() })
      .from(messagesTable)
      .where(eq(messagesTable.recipientId, user.id));
    const [unreadResult] = await db
      .select({ value: count() })
      .from(messagesTable)
      .where(and(eq(messagesTable.recipientId, user.id), eq(messagesTable.isRead, false)));
    const [unrepliedResult] = await db
      .select({ value: count() })
      .from(messagesTable)
      .where(and(eq(messagesTable.recipientId, user.id), isNull(messagesTable.ownerReply)));
    res.json({
      totalMessages: totalResult?.value ?? 0,
      unreadMessages: unreadResult?.value ?? 0,
      unrepliedMessages: unrepliedResult?.value ?? 0,
      linkOpens: user.linkOpens,
      isPremium: user.isPremium,
    });
  } catch (err) {
    req.log.error({ err }, "Error getting stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

const ID_STOP_WORDS = new Set([
  "yang", "dan", "di", "ke", "dari", "ini", "itu", "dengan", "untuk", "atau",
  "ada", "tidak", "aku", "kamu", "kami", "mereka", "dia", "saya", "kita",
  "bisa", "sudah", "akan", "juga", "tapi", "pada", "dalam", "lebih", "sering",
  "jadi", "sekarang", "kalau", "karena", "sangat", "punya", "sama", "satu",
  "banget", "gak", "ga", "jg", "udah", "tuh", "gue", "lo", "lu", "bgt",
  "wkwk", "haha", "hehe", "emang", "emg", "kalo", "kak", "mas", "mba",
  "how", "what", "the", "a", "is", "are", "was", "and", "or", "in", "of",
  "to", "you", "i", "it", "that", "for", "be", "do", "have", "nya", "nih",
  "ya", "dong", "aja", "deh", "kan", "lah",
]);

router.get("/wrapped/me", requireAuth, async (req, res) => {
  const clerkUserId = req.clerkUserId;

  const yearRaw = parseInt(req.query.year as string);
  if (isNaN(yearRaw) || yearRaw < 2000 || yearRaw > 2100) {
    res.status(400).json({ error: "Invalid year. Must be an integer between 2000 and 2100." });
    return;
  }
  const year = yearRaw;

  const monthRaw = req.query.month !== undefined ? parseInt(req.query.month as string) : null;
  if (monthRaw !== null && (isNaN(monthRaw) || monthRaw < 1 || monthRaw > 12)) {
    res.status(400).json({ error: "Invalid month. Must be an integer between 1 and 12." });
    return;
  }
  const month = monthRaw;

  const startDate = month ? new Date(year, month - 1, 1) : new Date(year, 0, 1);
  const endDate = month ? new Date(year, month, 1) : new Date(year + 1, 0, 1);

  try {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.clerkId, clerkUserId),
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const messages = await db.query.messagesTable.findMany({
      where: and(
        eq(messagesTable.recipientId, user.id),
        gte(messagesTable.createdAt, startDate),
        lt(messagesTable.createdAt, endDate),
      ),
    });

    const totalMessages = messages.length;
    const repliedMessages = messages.filter((m) => m.ownerReply !== null).length;

    const dayCount = new Array(7).fill(0);
    const hourCount = new Array(24).fill(0);
    for (const msg of messages) {
      const d = new Date(msg.createdAt);
      dayCount[d.getDay()]++;
      hourCount[d.getHours()]++;
    }

    const longestMsg = messages.reduce<string | null>((best, msg) => {
      return msg.content.length > (best?.length ?? 0) ? msg.content : best;
    }, null);

    const wordFreq = new Map<string, number>();
    for (const msg of messages) {
      const words = msg.content
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length >= 3 && !ID_STOP_WORDS.has(w));
      for (const word of words) {
        wordFreq.set(word, (wordFreq.get(word) ?? 0) + 1);
      }
    }
    const topWords = Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, count]) => ({ word, count }));

    res.json({
      year,
      month: month ?? null,
      totalMessages,
      repliedMessages,
      linkOpens: user.linkOpens,
      memberSince: user.createdAt,
      dayDistribution: dayCount.map((count, day) => ({ day, count })),
      hourDistribution: hourCount.map((count, hour) => ({ hour, count })),
      longestMessage: longestMsg,
      topWords,
    });
  } catch (err) {
    req.log.error({ err }, "Error getting wrapped stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", requireAuth, async (req, res) => {
  const clerkUserId = req.clerkUserId;
  const parsed = GetMyMessagesQueryParams.safeParse(req.query);
  const page = parsed.success ? (parsed.data.page ?? 1) : 1;
  const limit = parsed.success ? (parsed.data.limit ?? 20) : 20;
  const offset = (page - 1) * limit;
  try {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.clerkId, clerkUserId),
    });
    if (!user) {
      res.json({ messages: [], total: 0, page, limit });
      return;
    }
    const messages = await db.query.messagesTable.findMany({
      where: eq(messagesTable.recipientId, user.id),
      orderBy: [desc(messagesTable.createdAt)],
      limit,
      offset,
    });
    const [totalResult] = await db
      .select({ value: count() })
      .from(messagesTable)
      .where(eq(messagesTable.recipientId, user.id));
    await db
      .update(messagesTable)
      .set({ isRead: true })
      .where(and(eq(messagesTable.recipientId, user.id), eq(messagesTable.isRead, false)));

    // Batch-fetch campaign titles for messages that have a campaignId
    const campaignIds = [...new Set(
      messages.map(m => m.campaignId).filter((id): id is string => id !== null)
    )];
    const campaignTitleMap = new Map<string, string>();
    if (campaignIds.length > 0) {
      const campaigns = await db
        .select({ id: campaignsTable.id, title: campaignsTable.title })
        .from(campaignsTable)
        .where(inArray(campaignsTable.id, campaignIds));
      for (const c of campaigns) {
        campaignTitleMap.set(c.id, c.title);
      }
    }

    const messagesWithCampaign = messages.map(m => ({
      ...m,
      campaignTitle: m.campaignId ? (campaignTitleMap.get(m.campaignId) ?? null) : null,
    }));

    res.json({
      messages: messagesWithCampaign,
      total: totalResult?.value ?? 0,
      page,
      limit,
    });
  } catch (err) {
    req.log.error({ err }, "Error getting messages");
    res.status(500).json({ error: "Internal server error" });
  }
});

function hashIp(ip: string): string {
  const salt = process.env.SESSION_SECRET ?? "whisperbox-ip-salt";
  return createHash("sha256").update(ip + salt).digest("hex");
}

function getSenderIp(req: import("express").Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  const raw = Array.isArray(forwarded)
    ? forwarded[0]
    : (forwarded?.split(",")[0] ?? req.socket.remoteAddress ?? "unknown");
  return raw.trim();
}

router.post("/:username", async (req, res) => {
  const paramsParsed = SendMessageParams.safeParse(req.params);
  if (!paramsParsed.success) {
    res.status(400).json({ error: "Invalid params" });
    return;
  }
  const bodyParsed = SendMessageBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: "Invalid body", details: bodyParsed.error });
    return;
  }
  try {
    const recipient = await db.query.usersTable.findFirst({
      where: eq(usersTable.username, paramsParsed.data.username),
    });
    if (!recipient) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const senderIp = getSenderIp(req);
    const senderIpHash = hashIp(senderIp);

    // Configurable rate limiting: max N messages per M minutes
    const limitCount = parseInt(await getSetting("message_rate_limit_count", "5"), 10) || 5;
    const windowMinutes = parseInt(await getSetting("message_rate_limit_window_minutes", "10"), 10) || 10;
    const windowMs = windowMinutes * 60 * 1000;
    const now = Date.now();

    const timestamps = (rateLimitMap.get(senderIpHash) ?? []).filter(t => now - t < windowMs);
    if (timestamps.length >= limitCount) {
      rateLimitMap.set(senderIpHash, timestamps);
      const oldestTs = timestamps[0];
      const retryAfterMs = oldestTs + windowMs - now;
      const retryAfterMinutes = Math.max(1, Math.ceil(retryAfterMs / 60_000));
      res.status(429).json({
        error: `Terlalu banyak pesan. Tunggu ${retryAfterMinutes} menit lagi.`,
        retryAfterMinutes,
      });
      return;
    }
    timestamps.push(now);
    rateLimitMap.set(senderIpHash, timestamps);

    const activeCampaign = await db.query.campaignsTable.findFirst({
      where: and(
        eq(campaignsTable.userId, recipient.id),
        eq(campaignsTable.isActive, true),
      ),
    });

    const [message] = await db
      .insert(messagesTable)
      .values({
        recipientId: recipient.id,
        content: bodyParsed.data.content,
        isPublic: recipient.defaultPublicMessages,
        senderIpHash,
        senderEmail: bodyParsed.data.senderEmail ?? null,
        campaignId: activeCampaign?.id ?? null,
      })
      .returning();
    res.status(201).json(message);

    // Fire-and-forget email notification
    if (recipient.emailNotifications) {
      try {
        const clerkUser = await clerkClient.users.getUser(recipient.clerkId);
        const primaryEmail = clerkUser.emailAddresses.find(
          e => e.id === clerkUser.primaryEmailAddressId
        )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;
        if (primaryEmail) {
          const displayName = recipient.displayName || recipient.username;
          sendNewMessageNotification({
            toEmail: primaryEmail,
            toName: displayName,
            username: recipient.username,
          }).catch(() => {});
        }
      } catch {
        // Silently skip if Clerk lookup fails
      }
    }
  } catch (err) {
    req.log.error({ err }, "Error sending message");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:id/reply", requireAuth, async (req, res) => {
  const clerkUserId = req.clerkUserId;
  const paramsParsed = ReplyToMessageParams.safeParse(req.params);
  if (!paramsParsed.success) {
    res.status(400).json({ error: "Invalid params" });
    return;
  }
  const bodyParsed = ReplyToMessageBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: "Invalid body", details: bodyParsed.error });
    return;
  }
  try {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.clerkId, clerkUserId),
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const message = await db.query.messagesTable.findFirst({
      where: and(eq(messagesTable.id, paramsParsed.data.id), eq(messagesTable.recipientId, user.id)),
    });
    if (!message) {
      res.status(404).json({ error: "Message not found" });
      return;
    }
    const [updated] = await db
      .update(messagesTable)
      .set({ ownerReply: bodyParsed.data.reply, ownerRepliedAt: new Date() })
      .where(eq(messagesTable.id, paramsParsed.data.id))
      .returning();
    res.json(updated);

    // Fire-and-forget: notify anonymous sender if they provided an email
    if (message.senderEmail) {
      sendReplyNotification({
        toEmail: message.senderEmail,
        originalMessage: message.content,
        replyContent: bodyParsed.data.reply,
        ownerUsername: user.username,
      }).catch(() => {});
    }
  } catch (err) {
    req.log.error({ err }, "Error replying to message");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id/visibility", requireAuth, async (req, res) => {
  const clerkUserId = req.clerkUserId;
  const paramsParsed = ToggleMessageVisibilityParams.safeParse(req.params);
  if (!paramsParsed.success) {
    res.status(400).json({ error: "Invalid params" });
    return;
  }
  const bodyParsed = ToggleMessageVisibilityBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: "Invalid body", details: bodyParsed.error });
    return;
  }
  try {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.clerkId, clerkUserId),
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const message = await db.query.messagesTable.findFirst({
      where: and(eq(messagesTable.id, paramsParsed.data.id), eq(messagesTable.recipientId, user.id)),
    });
    if (!message) {
      res.status(404).json({ error: "Message not found" });
      return;
    }
    const [updated] = await db
      .update(messagesTable)
      .set({ isPublic: bodyParsed.data.isPublic })
      .where(eq(messagesTable.id, paramsParsed.data.id))
      .returning();
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Error updating visibility");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  const clerkUserId = req.clerkUserId;
  const parsed = DeleteMessageParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid params" });
    return;
  }
  try {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.clerkId, clerkUserId),
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const message = await db.query.messagesTable.findFirst({
      where: and(eq(messagesTable.id, parsed.data.id), eq(messagesTable.recipientId, user.id)),
    });
    if (!message) {
      res.status(404).json({ error: "Message not found" });
      return;
    }
    await db.delete(messagesTable).where(eq(messagesTable.id, parsed.data.id));
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Error deleting message");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
