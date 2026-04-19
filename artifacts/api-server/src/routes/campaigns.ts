import { Router } from "express";
import { db, usersTable, campaignsTable, messagesTable } from "@workspace/db";
import { eq, and, count } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import {
  CreateCampaignBody,
  EndCampaignParams,
  GetPublicCampaignParams,
} from "@workspace/api-zod";

const router = Router();

async function getCampaignWithCount(campaignId: string) {
  const [countResult] = await db
    .select({ value: count() })
    .from(messagesTable)
    .where(eq(messagesTable.campaignId, campaignId));
  return countResult?.value ?? 0;
}

router.get("/me", requireAuth, async (req, res) => {
  const clerkUserId = req.clerkUserId;
  try {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.clerkId, clerkUserId),
    });
    if (!user) {
      res.status(204).send();
      return;
    }

    const campaign = await db.query.campaignsTable.findFirst({
      where: and(
        eq(campaignsTable.userId, user.id),
        eq(campaignsTable.isActive, true),
      ),
    });
    if (!campaign) {
      res.status(204).send();
      return;
    }

    const responseCount = await getCampaignWithCount(campaign.id);
    res.json({ ...campaign, responseCount });
  } catch (err) {
    req.log.error({ err }, "Error getting campaign");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/me", requireAuth, async (req, res) => {
  const clerkUserId = req.clerkUserId;
  const bodyParsed = CreateCampaignBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: "Invalid body", details: bodyParsed.error });
    return;
  }
  try {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.clerkId, clerkUserId),
    });
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }
    if (!user.isPremium) {
      res
        .status(403)
        .json({ error: "Fitur ini hanya untuk pengguna Premium." });
      return;
    }

    await db
      .update(campaignsTable)
      .set({ isActive: false, endedAt: new Date() })
      .where(
        and(
          eq(campaignsTable.userId, user.id),
          eq(campaignsTable.isActive, true),
        ),
      );

    const [campaign] = await db
      .insert(campaignsTable)
      .values({
        userId: user.id,
        title: bodyParsed.data.title,
        question: bodyParsed.data.question,
        color: bodyParsed.data.color ?? "teal",
        icon: bodyParsed.data.icon ?? "megaphone",
      })
      .returning();

    res.status(201).json({ ...campaign, responseCount: 0 });
  } catch (err) {
    req.log.error({ err }, "Error creating campaign");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id/end", requireAuth, async (req, res) => {
  const clerkUserId = req.clerkUserId;
  const paramsParsed = EndCampaignParams.safeParse(req.params);
  if (!paramsParsed.success) {
    res.status(400).json({ error: "Invalid params" });
    return;
  }
  try {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.clerkId, clerkUserId),
    });
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const [updated] = await db
      .update(campaignsTable)
      .set({ isActive: false, endedAt: new Date() })
      .where(
        and(
          eq(campaignsTable.id, paramsParsed.data.id),
          eq(campaignsTable.userId, user.id),
        ),
      )
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Campaign not found" });
      return;
    }

    const responseCount = await getCampaignWithCount(updated.id);
    res.json({ ...updated, responseCount });
  } catch (err) {
    req.log.error({ err }, "Error ending campaign");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/public/:username", async (req, res) => {
  const paramsParsed = GetPublicCampaignParams.safeParse(req.params);
  if (!paramsParsed.success) {
    res.status(400).json({ error: "Invalid params" });
    return;
  }
  try {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.username, paramsParsed.data.username),
    });
    if (!user) {
      res.status(204).send();
      return;
    }

    const campaign = await db.query.campaignsTable.findFirst({
      where: and(
        eq(campaignsTable.userId, user.id),
        eq(campaignsTable.isActive, true),
      ),
    });
    if (!campaign) {
      res.status(204).send();
      return;
    }

    const responseCount = await getCampaignWithCount(campaign.id);
    res.json({ ...campaign, responseCount });
  } catch (err) {
    req.log.error({ err }, "Error getting public campaign");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
