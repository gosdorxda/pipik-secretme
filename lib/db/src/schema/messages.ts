import {
  pgTable,
  text,
  timestamp,
  boolean,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const messagesTable = pgTable("messages", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  recipientId: text("recipient_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  isPublic: boolean("is_public").notNull().default(false),
  ownerReply: text("owner_reply"),
  ownerRepliedAt: timestamp("owner_replied_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  senderIpHash: text("sender_ip_hash"),
  senderEmail: text("sender_email"),
  campaignId: text("campaign_id"),
});

export const insertMessageSchema = createInsertSchema(messagesTable).omit({
  id: true,
  createdAt: true,
  isRead: true,
  isPublic: true,
  ownerReply: true,
  ownerRepliedAt: true,
});
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messagesTable.$inferSelect;

export const REACTION_EMOJIS = ["❤️", "😂", "🔥", "😮", "👏"] as const;
export type ReactionEmoji = (typeof REACTION_EMOJIS)[number];

export const messageReactionsTable = pgTable(
  "message_reactions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    messageId: text("message_id")
      .notNull()
      .references(() => messagesTable.id, { onDelete: "cascade" }),
    emoji: text("emoji").notNull(),
    ipHash: text("ip_hash").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    uniqueIndex("message_reactions_unique").on(t.messageId, t.emoji, t.ipHash),
  ],
);

export type MessageReaction = typeof messageReactionsTable.$inferSelect;
