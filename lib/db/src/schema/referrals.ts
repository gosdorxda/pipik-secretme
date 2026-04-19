import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  unique,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const referralsTable = pgTable(
  "referrals",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    referrerId: text("referrer_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    referredUserId: text("referred_user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    pointsAwarded: integer("points_awarded").notNull().default(10),
    upgradeBonusAwarded: boolean("upgrade_bonus_awarded")
      .notNull()
      .default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    uniqReferral: unique().on(table.referredUserId),
  }),
);

export type Referral = typeof referralsTable.$inferSelect;
