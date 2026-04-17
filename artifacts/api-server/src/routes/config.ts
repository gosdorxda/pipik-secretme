import { Router } from "express";
import { getSetting } from "../lib/settingsCache";

const router = Router();

router.get("/config", async (req, res) => {
  try {
    const premiumPriceRaw = await getSetting("premium_price", "49900");
    const premiumPrice = parseInt(premiumPriceRaw, 10) || 49900;

    const notificationActive = await getSetting("notification_active", "false");
    const notificationMessage = await getSetting("notification_message", "");
    const notificationType = await getSetting("notification_type", "info");

    const redeemRateRaw = await getSetting("point_redeem_rate", "10000");
    const redeemRate = parseInt(redeemRateRaw, 10) || 10000;

    const referralSignupPointsRaw = await getSetting("referral_signup_points", "10");
    const referralSignupPoints = parseInt(referralSignupPointsRaw, 10) || 10;

    const linkOpensPointsPer1000Raw = await getSetting("link_opens_points_per_1000", "1");
    const linkOpensPointsPer1000 = parseInt(linkOpensPointsPer1000Raw, 10) || 1;

    const referralUpgradePointsRaw = await getSetting("referral_upgrade_points", "100");
    const referralUpgradePoints = parseInt(referralUpgradePointsRaw, 10) || 100;

    const themeAccent = await getSetting("theme_accent", "teal");
    const themeFont = await getSetting("theme_font", "space-grotesk");
    const themeRadius = await getSetting("theme_radius", "small");

    res.json({
      premiumPrice,
      redeemRate,
      referralSignupPoints,
      referralUpgradePoints,
      linkOpensPointsPer1000,
      notification: notificationActive === "true" && notificationMessage
        ? { message: notificationMessage, type: notificationType }
        : null,
      theme: { accent: themeAccent, font: themeFont, radius: themeRadius },
    });
  } catch {
    res.json({ premiumPrice: 49900, redeemRate: 10000, referralSignupPoints: 10, linkOpensPointsPer1000: 1, notification: null, theme: { accent: "teal", font: "space-grotesk", radius: "small" } });
  }
});

export default router;
