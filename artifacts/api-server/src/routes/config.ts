import { Router } from "express";
import { getSetting } from "../lib/settingsCache";
import { resolveStorageUrl } from "../lib/storageUrl";

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

    const referralSignupPointsRaw = await getSetting(
      "referral_signup_points",
      "10",
    );
    const referralSignupPoints = parseInt(referralSignupPointsRaw, 10) || 10;

    const linkOpensPointsPer1000Raw = await getSetting(
      "link_opens_points_per_1000",
      "1",
    );
    const linkOpensPointsPer1000 = parseInt(linkOpensPointsPer1000Raw, 10) || 1;

    const referralUpgradePointsRaw = await getSetting(
      "referral_upgrade_points",
      "100",
    );
    const referralUpgradePoints = parseInt(referralUpgradePointsRaw, 10) || 100;

    const siteLogoUrl = await getSetting("site_logo_url", "");
    const siteFaviconUrl = await getSetting("site_favicon_url", "");
    const appName = await getSetting("app_name", "vooi.lol");
    const contactEmail = await getSetting("contact_email", "");

    res.json({
      premiumPrice,
      redeemRate,
      referralSignupPoints,
      referralUpgradePoints,
      linkOpensPointsPer1000,
      logoUrl: resolveStorageUrl(siteLogoUrl) || null,
      faviconUrl: resolveStorageUrl(siteFaviconUrl) || null,
      appName: appName || "vooi.lol",
      contactEmail: contactEmail || null,
      notification:
        notificationActive === "true" && notificationMessage
          ? { message: notificationMessage, type: notificationType }
          : null,
    });
  } catch {
    res.json({
      premiumPrice: 49900,
      redeemRate: 10000,
      referralSignupPoints: 10,
      referralUpgradePoints: 100,
      linkOpensPointsPer1000: 1,
      logoUrl: null,
      faviconUrl: null,
      appName: "vooi.lol",
      contactEmail: null,
      notification: null,
    });
  }
});

export default router;
