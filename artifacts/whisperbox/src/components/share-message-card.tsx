import { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Download, Share, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { resolveAvatarUrl, fetchAsDataUrl } from "@/lib/avatar";
import { useSiteBranding } from "@/hooks/use-branding";

const PALETTES = [
  {
    accent: "#86ead4",
    accentBorder: "rgba(134,234,212,0.45)",
    stripBg: "rgba(134,234,212,0.12)",
    avatarBg: "#c6f6ed",
    avatarColor: "#0d4038",
    ctaColor: "#0d7062",
  },
  {
    accent: "#a5b4fc",
    accentBorder: "rgba(165,180,252,0.45)",
    stripBg: "rgba(165,180,252,0.12)",
    avatarBg: "#ddd6fe",
    avatarColor: "#3730a3",
    ctaColor: "#4338ca",
  },
  {
    accent: "#93c5fd",
    accentBorder: "rgba(147,197,253,0.45)",
    stripBg: "rgba(147,197,253,0.12)",
    avatarBg: "#bfdbfe",
    avatarColor: "#1e3a5f",
    ctaColor: "#1d4ed8",
  },
  {
    accent: "#fcd34d",
    accentBorder: "rgba(252,211,77,0.45)",
    stripBg: "rgba(252,211,77,0.12)",
    avatarBg: "#fde68a",
    avatarColor: "#713f12",
    ctaColor: "#92400e",
  },
];

type ShareMessageCardProps = {
  content: string;
  createdAt: string;
  ownerReply?: string | null;
  paletteIdx: number;
  displayName: string;
  username: string;
  avatarUrl?: string | null;
  onClose: () => void;
};

export function ShareMessageCard({
  content,
  createdAt,
  paletteIdx,
  displayName,
  username,
  avatarUrl,
  onClose,
}: ShareMessageCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { data: branding } = useSiteBranding();
  const appName = branding?.appName ?? "vooi.lol";
  const p = PALETTES[paletteIdx % PALETTES.length];

  const [avatarDataUrl, setAvatarDataUrl] = useState<string | null>(null);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const resolved = resolveAvatarUrl(avatarUrl);
    if (resolved) {
      fetchAsDataUrl(resolved).then(setAvatarDataUrl);
    } else {
      setAvatarDataUrl(null);
    }
  }, [avatarUrl]);

  useEffect(() => {
    if (branding?.logoUrl) {
      fetchAsDataUrl(branding.logoUrl).then(setLogoDataUrl);
    } else {
      setLogoDataUrl(null);
    }
  }, [branding?.logoUrl]);

  const initials = (displayName || username || "?")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const publicUrl = `${window.location.origin}/@${username}`;
  const timeAgo = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
    locale: idLocale,
  });
  const truncated =
    content.length > 280 ? content.slice(0, 277) + "…" : content;

  const generate = async (): Promise<string | null> => {
    if (!cardRef.current) return null;
    setIsGenerating(true);
    try {
      return await toPng(cardRef.current, { pixelRatio: 3, cacheBust: true });
    } catch {
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    const url = await generate();
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = `${appName.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-message.png`;
    a.click();
  };

  const handleShare = async () => {
    const url = await generate();
    if (!url) return;
    const slug = appName.replace(/[^a-z0-9]/gi, "-").toLowerCase();
    try {
      const blob = await (await fetch(url)).blob();
      const file = new File([blob], `${slug}-message.png`, {
        type: "image/png",
      });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: appName,
          text: `Kirim pesan anonim ke ${displayName || username} di ${publicUrl}`,
        });
      } else {
        const a = document.createElement("a");
        a.href = url;
        a.download = `${slug}-message.png`;
        a.click();
      }
    } catch {}
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm space-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between text-white px-1">
          <span className="text-sm font-semibold opacity-80">
            Preview Gambar
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ═══ Card that gets captured ═══ */}
        <div
          ref={cardRef}
          style={{
            background: "#ffffff",
            borderRadius: 14,
            overflow: "hidden",
            width: "100%",
            fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
          }}
        >
          {/* ── Zone 1: Dark header label ── */}
          <div
            style={{
              background: "#0f172a",
              padding: "11px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {/* Lock icon */}
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke={p.accent}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: p.accent,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Pesan Anonim
              </span>
            </div>
            <span
              style={{
                fontSize: 10,
                color: "#64748b",
                fontWeight: 500,
              }}
            >
              {timeAgo}
            </span>
          </div>

          {/* ── Zone 2: Body ── */}
          <div style={{ padding: "16px 16px 14px" }}>
            {/* Anonymous sender bubble */}
            <div
              style={{
                background: "#f8fafc",
                border: `1.5px solid ${p.accentBorder}`,
                borderRadius: 10,
                padding: "13px 15px",
              }}
            >
              {/* Sender label row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  marginBottom: 11,
                }}
              >
                {/* Anonymous silhouette avatar */}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "#e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    <line x1="12" y1="15" x2="12" y2="15.01" />
                  </svg>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#64748b",
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    Seseorang anonim
                  </p>
                  <p
                    style={{
                      fontSize: 10,
                      color: "#94a3b8",
                      margin: "2px 0 0",
                      lineHeight: 1,
                    }}
                  >
                    identitas disembunyikan
                  </p>
                </div>
              </div>

              {/* Message text */}
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 450,
                  lineHeight: 1.65,
                  color: "#1e293b",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  margin: 0,
                }}
              >
                {truncated}
              </p>
            </div>

            {/* Arrow connector */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "7px 0",
                gap: 1,
              }}
            >
              <div style={{ width: 1.5, height: 10, background: "#cbd5e1" }} />
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path
                  d="M6 7L1 1.5M6 7L11 1.5"
                  stroke="#cbd5e1"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Recipient strip */}
            <div
              style={{
                background: p.stripBg,
                border: `1.5px solid ${p.accentBorder}`,
                borderRadius: 10,
                padding: "12px 15px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              {/* Profile avatar */}
              {avatarDataUrl ? (
                <img
                  src={avatarDataUrl}
                  alt={displayName || username}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    objectFit: "cover",
                    flexShrink: 0,
                    backgroundColor: "#e2e8f0",
                    border: `2px solid ${p.accent}`,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: p.avatarBg,
                    color: p.avatarColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    fontWeight: 800,
                    flexShrink: 0,
                    border: `2px solid ${p.accent}`,
                  }}
                >
                  {initials}
                </div>
              )}

              {/* Name + username */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#09090b",
                    margin: 0,
                    lineHeight: 1.3,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {displayName || username}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: "#71717a",
                    margin: "2px 0 0",
                    lineHeight: 1,
                  }}
                >
                  @{username}
                </p>
              </div>

              {/* CTA */}
              <div
                style={{
                  flexShrink: 0,
                  textAlign: "right",
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: p.ctaColor,
                    margin: 0,
                    lineHeight: 1.35,
                  }}
                >
                  Kirimi aku
                  <br />
                  juga! →
                </p>
              </div>
            </div>
          </div>

          {/* ── Zone 3: Footer branding ── */}
          <div
            style={{
              padding: "9px 16px",
              background: "#f9fafb",
              borderTop: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p
              style={{
                fontSize: 10,
                color: "#94a3b8",
                margin: 0,
                lineHeight: 1.4,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "60%",
              }}
            >
              {publicUrl}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                flexShrink: 0,
              }}
            >
              {logoDataUrl ? (
                <img
                  src={logoDataUrl}
                  alt={appName}
                  style={{
                    width: 15,
                    height: 15,
                    borderRadius: 3,
                    flexShrink: 0,
                  }}
                />
              ) : (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 160 160"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ borderRadius: 3, flexShrink: 0 }}
                >
                  <rect width="160" height="160" rx="36" fill="#86ead4" />
                  <path
                    d="M32 44C32 37.373 37.373 32 44 32H116C122.627 32 128 37.373 128 44V92C128 98.627 122.627 104 116 104H90L80 124L70 104H44C37.373 104 32 98.627 32 92V44Z"
                    fill="#1a443c"
                  />
                  <circle cx="60" cy="68" r="7" fill="#86ead4" />
                  <circle cx="80" cy="68" r="7" fill="#86ead4" />
                  <circle cx="100" cy="68" r="7" fill="#86ead4" />
                </svg>
              )}
              <span style={{ fontSize: 10, fontWeight: 700, color: "#334155" }}>
                {appName}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            className="flex-1 gap-2"
            variant="secondary"
            onClick={handleDownload}
            disabled={isGenerating}
          >
            <Download className="w-4 h-4" />
            {isGenerating ? "Memproses…" : "Unduh"}
          </Button>
          <Button
            className="flex-1 gap-2"
            onClick={handleShare}
            disabled={isGenerating}
          >
            <Share className="w-4 h-4" />
            Bagikan
          </Button>
        </div>
      </div>
    </div>
  );
}
