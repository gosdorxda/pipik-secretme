import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const systemSettingsTable = pgTable("system_settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: text("value"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type SystemSetting = typeof systemSettingsTable.$inferSelect;

export const SETTING_KEYS = {
  PREMIUM_PRICE: "premium_price",
  REFERRAL_SIGNUP_POINTS: "referral_signup_points",
  REFERRAL_UPGRADE_POINTS: "referral_upgrade_points",
  RESEND_FROM_EMAIL: "resend_from_email",
  TRIPAY_MERCHANT_CODE: "tripay_merchant_code",
  MAINTENANCE_MODE: "maintenance_mode",
  APP_NAME: "app_name",
  APP_DESCRIPTION: "app_description",
  POINT_REDEEM_RATE: "point_redeem_rate",
} as const;
