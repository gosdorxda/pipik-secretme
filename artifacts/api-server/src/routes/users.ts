import { Router } from "express";
import { db, usersTable, messagesTable, type InsertUser } from "@workspace/db";
import { eq, and, desc, sql } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { UpdateMyProfileBody, GetPublicProfileParams } from "@workspace/api-zod";

const router = Router();

router.get("/me", requireAuth, async (req, res) => {
  const clerkUserId = (req as any).clerkUserId as string;
  try {
    let user = await db.query.usersTable.findFirst({
      where: eq(usersTable.clerkId, clerkUserId),
    });
    if (!user) {
      const username = `user_${clerkUserId.slice(-8)}`;
      const newUser: InsertUser = {
        clerkId: clerkUserId,
        username,
      };
      const [created] = await db.insert(usersTable).values(newUser).returning();
      user = created;
    }
    res.json(user);
  } catch (err) {
    req.log.error({ err }, "Error getting profile");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/me", requireAuth, async (req, res) => {
  const clerkUserId = (req as any).clerkUserId as string;
  const parsed = UpdateMyProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body", details: parsed.error });
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
    if (parsed.data.username && parsed.data.username !== user.username) {
      const existing = await db.query.usersTable.findFirst({
        where: eq(usersTable.username, parsed.data.username),
      });
      if (existing) {
        res.status(409).json({ error: "Username already taken" });
        return;
      }
    }

    const premiumFields = [
      "socialInstagram", "socialTiktok", "socialX",
      "socialFacebook", "socialGithub", "socialLinkedin",
      "emailNotifications",
    ] as const;
    const hasPremiumField = premiumFields.some(
      (f) => parsed.data[f] !== undefined
    );
    if (hasPremiumField && !user.isPremium) {
      res.status(403).json({ error: "upgrade_required" });
      return;
    }

    const [updated] = await db
      .update(usersTable)
      .set({
        ...(parsed.data.username !== undefined && { username: parsed.data.username }),
        ...(parsed.data.displayName !== undefined && { displayName: parsed.data.displayName }),
        ...(parsed.data.bio !== undefined && { bio: parsed.data.bio }),
        ...(parsed.data.avatarUrl !== undefined && { avatarUrl: parsed.data.avatarUrl }),
        ...(parsed.data.defaultPublicMessages !== undefined && { defaultPublicMessages: parsed.data.defaultPublicMessages }),
        ...(parsed.data.socialInstagram !== undefined && { socialInstagram: parsed.data.socialInstagram }),
        ...(parsed.data.socialTiktok !== undefined && { socialTiktok: parsed.data.socialTiktok }),
        ...(parsed.data.socialX !== undefined && { socialX: parsed.data.socialX }),
        ...(parsed.data.socialFacebook !== undefined && { socialFacebook: parsed.data.socialFacebook }),
        ...(parsed.data.socialGithub !== undefined && { socialGithub: parsed.data.socialGithub }),
        ...(parsed.data.socialLinkedin !== undefined && { socialLinkedin: parsed.data.socialLinkedin }),
        ...(parsed.data.emailNotifications !== undefined && { emailNotifications: parsed.data.emailNotifications }),
        updatedAt: new Date(),
      })
      .where(eq(usersTable.clerkId, clerkUserId))
      .returning();

    if (parsed.data.defaultPublicMessages !== undefined) {
      await db
        .update(messagesTable)
        .set({ isPublic: parsed.data.defaultPublicMessages })
        .where(eq(messagesTable.recipientId, user.id));
    }
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Error updating profile");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:username", async (req, res) => {
  const parsed = GetPublicProfileParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid params" });
    return;
  }
  try {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.username, parsed.data.username),
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    await db
      .update(usersTable)
      .set({ linkOpens: sql`${usersTable.linkOpens} + 1` })
      .where(eq(usersTable.id, user.id));
    const publicMessages = await db.query.messagesTable.findMany({
      where: and(
        eq(messagesTable.recipientId, user.id),
        eq(messagesTable.isPublic, true)
      ),
      orderBy: [desc(messagesTable.createdAt)],
    });
    res.json({
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      isPremium: user.isPremium,
      socialInstagram: user.socialInstagram,
      socialTiktok: user.socialTiktok,
      socialX: user.socialX,
      socialFacebook: user.socialFacebook,
      socialGithub: user.socialGithub,
      socialLinkedin: user.socialLinkedin,
      publicMessages: publicMessages.map(m => ({
        id: m.id,
        content: m.content,
        createdAt: m.createdAt,
        ownerReply: m.ownerReply,
        ownerRepliedAt: m.ownerRepliedAt,
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Error getting public profile");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
