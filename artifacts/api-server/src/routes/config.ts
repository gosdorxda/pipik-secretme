import { Router } from "express";
import { getSetting } from "../lib/settingsCache";
import { resolveStorageUrl } from "../lib/storageUrl";

const router = Router();

// Teal fallback SVGs — served inline when no custom branding is configured
// or when the external URL is temporarily unavailable.
const FALLBACK_FAVICON_SVG = `<svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="180" height="180" rx="36" fill="#86ead4"/>
  <path d="M34 50C34 40.6 41.6 33 51 33H129C138.4 33 146 40.6 146 50V108C146 117.4 138.4 125 129 125H103L90 150L77 125H51C41.6 125 34 117.4 34 108V50Z" fill="#1a443c"/>
  <circle cx="68" cy="79" r="9" fill="#86ead4"/>
  <circle cx="90" cy="79" r="9" fill="#86ead4"/>
  <circle cx="112" cy="79" r="9" fill="#86ead4"/>
</svg>`;

const FALLBACK_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" fill="none">
  <rect width="160" height="160" rx="36" fill="#86ead4"/>
  <path d="M32 44C32 37.373 37.373 32 44 32H116C122.627 32 128 37.373 128 44V92C128 98.627 122.627 104 116 104H90L80 124L70 104H44C37.373 104 32 98.627 32 92V44Z" fill="#1a443c"/>
  <circle cx="60" cy="68" r="7" fill="#86ead4"/>
  <circle cx="80" cy="68" r="7" fill="#86ead4"/>
  <circle cx="100" cy="68" r="7" fill="#86ead4"/>
</svg>`;

const SVG_CACHE_HEADERS = {
  "Content-Type": "image/svg+xml",
  "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
} as const;

/**
 * Proxy a branding asset URL, returning its content directly.
 * Relative URLs (e.g. /api/storage/objects/…) are resolved against localhost.
 * Returns null if the URL is empty or the upstream request fails.
 */
async function proxyBrandingAsset(
  assetUrl: string,
  port: number,
): Promise<{ contentType: string; body: Buffer } | null> {
  if (!assetUrl) return null;
  try {
    const targetUrl = assetUrl.startsWith("/")
      ? `http://localhost:${port}${assetUrl}`
      : assetUrl;
    const upstream = await fetch(targetUrl, {
      signal: AbortSignal.timeout(3000),
    });
    if (!upstream.ok) return null;
    const contentType = upstream.headers.get("content-type") ?? "image/svg+xml";
    const body = Buffer.from(await upstream.arrayBuffer());
    return { contentType, body };
  } catch {
    return null;
  }
}

// Favicon endpoint — browser reads this before JS loads.
// Proxies the configured favicon so fallback to the local teal SVG works
// even when the external storage URL is temporarily unavailable.
router.get("/favicon.ico", async (req, res) => {
  try {
    const raw = await getSetting("site_favicon_url", "");
    const faviconUrl = resolveStorageUrl(raw);
    if (faviconUrl) {
      const apiPort = Number(process.env.PORT ?? 8080);
      const proxied = await proxyBrandingAsset(faviconUrl, apiPort);
      if (proxied) {
        res.setHeader("Content-Type", proxied.contentType);
        res.setHeader(
          "Cache-Control",
          "public, max-age=300, stale-while-revalidate=3600",
        );
        res.send(proxied.body);
        return;
      }
    }
  } catch {
    // fall through to inline fallback
  }
  res.set(SVG_CACHE_HEADERS).send(FALLBACK_FAVICON_SVG);
});

// Logo endpoint — same pattern as favicon; used by SiteLogoImg so the
// correct logo renders on first paint without waiting for the branding API.
router.get("/logo", async (req, res) => {
  try {
    const raw = await getSetting("site_logo_url", "");
    const logoUrl = resolveStorageUrl(raw);
    if (logoUrl) {
      const apiPort = Number(process.env.PORT ?? 8080);
      const proxied = await proxyBrandingAsset(logoUrl, apiPort);
      if (proxied) {
        res.setHeader("Content-Type", proxied.contentType);
        res.setHeader(
          "Cache-Control",
          "public, max-age=300, stale-while-revalidate=3600",
        );
        res.send(proxied.body);
        return;
      }
    }
  } catch {
    // fall through to inline fallback
  }
  res.set(SVG_CACHE_HEADERS).send(FALLBACK_LOGO_SVG);
});

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
    const appName = await getSetting("app_name", "kepoin.me");
    const contactEmail = await getSetting("contact_email", "");
    const googleAnalyticsId = await getSetting("google_analytics_id", "");
    const bannerAdActive = await getSetting("banner_ad_active", "false");
    const bannerAdImageUrl = await getSetting("banner_ad_image_url", "");
    const bannerAdLinkUrl = await getSetting("banner_ad_link_url", "");
    const bannerAdAlt = await getSetting("banner_ad_alt", "");

    res.json({
      premiumPrice,
      redeemRate,
      referralSignupPoints,
      referralUpgradePoints,
      linkOpensPointsPer1000,
      logoUrl: resolveStorageUrl(siteLogoUrl) || null,
      faviconUrl: resolveStorageUrl(siteFaviconUrl) || null,
      appName: appName || "kepoin.me",
      contactEmail: contactEmail || null,
      notification:
        notificationActive === "true" && notificationMessage
          ? { message: notificationMessage, type: notificationType }
          : null,
      googleAnalyticsId: googleAnalyticsId || null,
      bannerAd:
        bannerAdActive === "true" && bannerAdImageUrl
          ? {
              imageUrl: bannerAdImageUrl,
              linkUrl: bannerAdLinkUrl || null,
              alt: bannerAdAlt || "Iklan",
            }
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
      appName: "kepoin.me",
      contactEmail: null,
      notification: null,
      googleAnalyticsId: null,
      bannerAd: null,
    });
  }
});

export default router;
