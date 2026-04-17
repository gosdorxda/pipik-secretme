import { pgTable, text, timestamp, integer, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const transactionsTable = pgTable("transactions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  tripayRef: text("tripay_ref").unique(),
  merchantRef: text("merchant_ref").notNull().unique(),
  amount: integer("amount").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("UNPAID"),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Transaction = typeof transactionsTable.$inferSelect;
