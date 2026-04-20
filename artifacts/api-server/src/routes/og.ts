import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Router, type IRouter } from "express";
import { db, usersTable, messagesTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import QRCode from "qrcode";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const PALETTES = [
  {
    accent: "#86ead4",
    avatarBg: "#c6f6ed",
    avatarColor: "#0d4038",
    qrFg: "#0f2e28",
    pillBg: "rgba(134,234,212,0.15)",
    ctaBg: "rgba(134,234,212,0.08)",
  },
  {
    accent: "#a5b4fc",
    avatarBg: "#ddd6fe",
    avatarColor: "#3730a3",
    qrFg: "#1e1b4b",
    pillBg: "rgba(165,180,252,0.15)",
    ctaBg: "rgba(165,180,252,0.08)",
  },
  {
    accent: "#93c5fd",
    avatarBg: "#bfdbfe",
    avatarColor: "#1e3a5f",
    qrFg: "#1e3a5f",
    pillBg: "rgba(147,197,253,0.15)",
    ctaBg: "rgba(147,197,253,0.08)",
  },
  {
    accent: "#fcd34d",
    avatarBg: "#fde68a",
    avatarColor: "#713f12",
    qrFg: "#451a03",
    pillBg: "rgba(252,211,77,0.15)",
    ctaBg: "rgba(252,211,77,0.08)",
  },
];

function hashUsername(username: string): number {
  let h = 0;
  for (let i = 0; i < username.length; i++) {
    h = Math.imul(31, h) + username.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h) % PALETTES.length;
}

let fontData: ArrayBuffer | null = null;
async function loadFont(): Promise<ArrayBuffer> {
  if (fontData) return fontData;
  try {
    const distDir = path.dirname(fileURLToPath(import.meta.url));
    const fontPath = path.resolve(distDir, "../src/assets/inter-400.woff");
    const buf = fs.readFileSync(fontPath);
    fontData = buf.buffer.slice(
      buf.byteOffset,
      buf.byteOffset + buf.byteLength,
    );
  } catch {
    const res = await fetch(
      "https://cdn.jsdelivr.net/npm/@fontsource/inter@4.0.0/files/inter-latin-400-normal.woff",
    );
    fontData = await res.arrayBuffer();
  }
  return fontData as ArrayBuffer;
}

async function fetchAvatarBase64(
  avatarUrl: string | null | undefined,
  port: string | undefined,
): Promise<string | null> {
  if (!avatarUrl) return null;
  try {
    const url = avatarUrl.startsWith("/objects/")
      ? `http://localhost:${port}/api/storage${avatarUrl}`
      : avatarUrl;
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 3000);
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    const ct = res.headers.get("content-type") ?? "image/jpeg";
    return `data:${ct};base64,${Buffer.from(buf).toString("base64")}`;
  } catch {
    return null;
  }
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

type SatoriNode = {
  type: string;
  props: Record<string, unknown>;
};

function div(
  style: Record<string, unknown>,
  ...children: unknown[]
): SatoriNode {
  const kids = children.filter((c) => c !== null && c !== undefined);
  const childProp =
    kids.length === 0 ? {} : { children: kids.length === 1 ? kids[0] : kids };
  return { type: "div", props: { style, ...childProp } };
}

function img(props: Record<string, unknown>): SatoriNode {
  return { type: "img", props };
}

router.get("/profile/:username", async (req, res) => {
  const { username } = req.params as { username: string };

  try {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.username, username.toLowerCase()),
      columns: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
      },
    });

    if (!user) {
      res.status(404).send("Not found");
      return;
    }

    const [[{ msgCount }], font, qrDataUrl, avatarBase64] = await Promise.all([
      db
        .select({ msgCount: count() })
        .from(messagesTable)
        .where(eq(messagesTable.recipientId, user.id)),
      loadFont(),
      QRCode.toDataURL(`https://kepoin.me/@${user.username}`, {
        width: 280,
        margin: 1,
        color: {
          dark: PALETTES[hashUsername(user.username)].qrFg,
          light: "#ffffff",
        },
      }),
      fetchAvatarBase64(user.avatarUrl, process.env["PORT"]),
    ]);

    const p = PALETTES[hashUsername(user.username)];
    const name = user.displayName ?? user.username;
    const bio =
      user.bio && user.bio.trim()
        ? user.bio.length > 120
          ? user.bio.slice(0, 117) + "…"
          : user.bio
        : null;
    const msgLabel = `${Number(msgCount).toLocaleString("id-ID")} pesan diterima`;
    const ctaLabel = `Kirim pesan anonim ke @${user.username} →`;

    const avatarNode: SatoriNode = avatarBase64
      ? img({
          src: avatarBase64,
          style: {
            width: 96,
            height: 96,
            borderRadius: "50%",
            border: `4px solid ${p.accent}`,
            objectFit: "cover",
          },
        })
      : div(
          {
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: p.avatarBg,
            border: `4px solid ${p.accent}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            fontWeight: 700,
            color: p.avatarColor,
            flexShrink: 0,
          },
          initials(name),
        );

    const tree = div(
      {
        width: 1200,
        height: 630,
        background: "#0f172a",
        display: "flex",
        flexDirection: "column",
        fontFamily: '"Inter"',
      },
      // top accent bar
      div({ width: "100%", height: 6, background: p.accent, flexShrink: 0 }),
      // main content
      div(
        {
          display: "flex",
          flex: 1,
          padding: "40px 56px",
          gap: "0px",
          overflow: "hidden",
        },
        // left column
        div(
          {
            display: "flex",
            flexDirection: "column",
            flex: 1,
            paddingRight: 52,
            borderRight: "1px solid rgba(255,255,255,0.08)",
            overflow: "hidden",
          },
          // avatar + name row
          div(
            {
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginBottom: 20,
            },
            avatarNode,
            // name + username stacked
            div(
              {
                display: "flex",
                flexDirection: "column",
                gap: 4,
                flex: 1,
                overflow: "hidden",
              },
              // display name
              div(
                {
                  fontSize: 38,
                  fontWeight: 700,
                  color: "#f8fafc",
                  lineHeight: 1.2,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                },
                name,
              ),
              // username
              div(
                {
                  fontSize: 22,
                  color: p.accent,
                  fontWeight: 500,
                },
                `@${user.username}`,
              ),
            ),
          ),
          // bio (optional)
          ...(bio
            ? [
                div(
                  {
                    fontSize: 18,
                    color: "#94a3b8",
                    lineHeight: 1.6,
                    marginBottom: 16,
                    overflow: "hidden",
                  },
                  bio,
                ),
              ]
            : []),
          // spacer
          div({ flex: 1 }),
          // message count pill
          div(
            {
              display: "flex",
              alignItems: "center",
              marginBottom: 14,
            },
            div(
              {
                background: p.pillBg,
                border: `1px solid ${p.accent}44`,
                borderRadius: 8,
                padding: "8px 16px",
                fontSize: 18,
                color: p.accent,
                fontWeight: 600,
              },
              msgLabel,
            ),
          ),
          // CTA
          div(
            {
              background: p.ctaBg,
              border: `1px solid ${p.accent}33`,
              borderRadius: 10,
              padding: "14px 20px",
              fontSize: 18,
              color: "#e2e8f0",
              fontWeight: 500,
            },
            ctaLabel,
          ),
        ),
        // right column
        div(
          {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: 380,
            paddingLeft: 52,
            gap: 16,
          },
          // QR box
          div(
            {
              display: "flex",
              padding: 12,
              background: "#ffffff",
              borderRadius: 12,
              border: `4px solid ${p.accent}`,
            },
            img({
              src: qrDataUrl,
              style: {
                width: 240,
                height: 240,
                display: "block",
                borderRadius: 4,
              },
            }),
          ),
          // scan text
          div(
            {
              fontSize: 15,
              color: "#64748b",
              textAlign: "center",
            },
            "Scan untuk kirim pesan anonim",
          ),
          // brand
          div(
            {
              fontSize: 26,
              fontWeight: 800,
              color: p.accent,
              letterSpacing: "-0.5px",
            },
            "kepoin.me",
          ),
        ),
      ),
      // bottom bar
      div(
        {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: 44,
          background: "rgba(255,255,255,0.03)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        },
        div(
          {
            fontSize: 14,
            color: "#475569",
            letterSpacing: "0.3px",
          },
          "kepoin.me — Platform Pesan Anonim #1 di Indonesia",
        ),
      ),
    );

    const svg = await satori(tree as Parameters<typeof satori>[0], {
      width: 1200,
      height: 630,
      fonts: [{ name: "Inter", data: font, weight: 400, style: "normal" }],
    });

    const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } });
    const png = resvg.render().asPng();

    res.set({
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    });
    res.send(png);
  } catch (err) {
    logger.error({ err }, "Error generating OG image");
    res.status(500).send("Internal server error");
  }
});

export default router;
