import { Router, type Request } from "express";
import { db, usersTable } from "@workspace/db";
import { and, eq, isNotNull } from "drizzle-orm";
import { logger } from "../lib/logger";

const router: Router = Router();

function getSiteBaseUrl(req: Request): string {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/+$/, "");
  const proto =
    (req.headers["x-forwarded-proto"] as string | undefined) ?? req.protocol;
  const host =
    (req.headers["x-forwarded-host"] as string | undefined) ??
    (req.headers["host"] as string | undefined) ??
    "kepoin.me";
  return `${proto}://${host}`;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const STATIC_PAGES: Array<{
  path: string;
  changefreq: string;
  priority: string;
}> = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/tentang", changefreq: "monthly", priority: "0.6" },
  { path: "/cara-pakai", changefreq: "monthly", priority: "0.6" },
  { path: "/faq", changefreq: "monthly", priority: "0.6" },
  { path: "/privasi", changefreq: "yearly", priority: "0.3" },
  { path: "/ketentuan", changefreq: "yearly", priority: "0.3" },
  { path: "/sign-in", changefreq: "yearly", priority: "0.4" },
  { path: "/sign-up", changefreq: "yearly", priority: "0.5" },
];

router.get("/sitemap.xml", async (req, res) => {
  const base = getSiteBaseUrl(req);
  try {
    const users = await db
      .select({
        username: usersTable.username,
        updatedAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(
        and(
          eq(usersTable.hasSetUsername, true),
          isNotNull(usersTable.username),
        ),
      );

    const now = new Date().toISOString();

    const urls: string[] = [];

    for (const page of STATIC_PAGES) {
      urls.push(
        [
          "  <url>",
          `    <loc>${esc(base + page.path)}</loc>`,
          `    <lastmod>${now}</lastmod>`,
          `    <changefreq>${page.changefreq}</changefreq>`,
          `    <priority>${page.priority}</priority>`,
          "  </url>",
        ].join("\n"),
      );
    }

    for (const u of users) {
      if (!u.username) continue;
      const lastmod = u.updatedAt ? new Date(u.updatedAt).toISOString() : now;
      urls.push(
        [
          "  <url>",
          `    <loc>${esc(`${base}/@${u.username}`)}</loc>`,
          `    <lastmod>${lastmod}</lastmod>`,
          `    <changefreq>weekly</changefreq>`,
          `    <priority>0.7</priority>`,
          "  </url>",
        ].join("\n"),
      );
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

    res.set("Content-Type", "application/xml; charset=utf-8");
    res.set(
      "Cache-Control",
      "public, max-age=900, stale-while-revalidate=3600",
    );
    res.send(xml);
  } catch (err) {
    logger.error({ err }, "Error generating sitemap.xml");
    res.status(500).set("Content-Type", "text/plain").send("Error");
  }
});

export default router;
