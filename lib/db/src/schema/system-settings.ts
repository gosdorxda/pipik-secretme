import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const systemSettingsTable = pgTable("system_settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: text("value"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
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
  EMAIL_NEW_MSG_SUBJECT: "email_new_msg_subject",
  EMAIL_NEW_MSG_INTRO: "email_new_msg_intro",
  EMAIL_REPLY_SUBJECT: "email_reply_subject",
  EMAIL_REPLY_INTRO: "email_reply_intro",
  SITE_LOGO_URL: "site_logo_url",
  SITE_FAVICON_URL: "site_favicon_url",
  FREE_PREMIUM_MODE: "free_premium_mode",
  GOOGLE_ANALYTICS_ID: "google_analytics_id",
  BANNER_AD_ACTIVE: "banner_ad_active",
  BANNER_AD_IMAGE_URL: "banner_ad_image_url",
  BANNER_AD_LINK_URL: "banner_ad_link_url",
  BANNER_AD_ALT: "banner_ad_alt",
} as const;
