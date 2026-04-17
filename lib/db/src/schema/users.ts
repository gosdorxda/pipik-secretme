import { pgTable, text, timestamp, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  clerkId: text("clerk_id").notNull().unique(),
  username: varchar("username", { length: 32 }).notNull().unique(),
  displayName: varchar("display_name", { length: 64 }),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  isPremium: boolean("is_premium").notNull().default(false),
  defaultPublicMessages: boolean("default_public_messages").notNull().default(true),
  socialInstagram: varchar("social_instagram", { length: 100 }),
  socialTiktok: varchar("social_tiktok", { length: 100 }),
  socialX: varchar("social_x", { length: 100 }),
  socialFacebook: varchar("social_facebook", { length: 100 }),
  socialGithub: varchar("social_github", { length: 100 }),
  socialLinkedin: varchar("social_linkedin", { length: 100 }),
  emailNotifications: boolean("email_notifications").notNull().default(false),
  linkOpens: integer("link_opens").notNull().default(0),
  referralCode: varchar("referral_code", { length: 16 }).unique(),
  points: integer("points").notNull().default(0),
  redeemedPoints: integer("redeemed_points").notNull().default(0),
  isAdmin: boolean("is_admin").notNull().default(false),
  hasSetUsername: boolean("has_set_username").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
