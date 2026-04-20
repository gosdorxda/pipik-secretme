import { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Download, Share, X } from "lucide-react";
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
    qrFg: "#0f2e28",
    qrRing: "rgba(134,234,212,0.30)",
  },
  {
    accent: "#a5b4fc",
    accentBorder: "rgba(165,180,252,0.45)",
    stripBg: "rgba(165,180,252,0.12)",
    avatarBg: "#ddd6fe",
    avatarColor: "#3730a3",
    ctaColor: "#4338ca",
    qrFg: "#1e1b4b",
    qrRing: "rgba(165,180,252,0.30)",
  },
  {
    accent: "#93c5fd",
    accentBorder: "rgba(147,197,253,0.45)",
    stripBg: "rgba(147,197,253,0.12)",
    avatarBg: "#bfdbfe",
    avatarColor: "#1e3a5f",
    ctaColor: "#1d4ed8",
    qrFg: "#1e3a5f",
    qrRing: "rgba(147,197,253,0.30)",
  },
  {
    accent: "#fcd34d",
    accentBorder: "rgba(252,211,77,0.45)",
    stripBg: "rgba(252,211,77,0.12)",
    avatarBg: "#fde68a",
    avatarColor: "#713f12",
    ctaColor: "#92400e",
    qrFg: "#451a03",
    qrRing: "rgba(252,211,77,0.30)",
  },
];

type QRProfileCardProps = {
  displayName: string;
  username: string;
  bio?: string | null;
  avatarUrl?: string | null;
  totalMessages: number;
  paletteIdx?: number;
  onClose: () => void;
};

export function QRProfileCard({
  displayName,
  username,
  bio,
  avatarUrl,
  totalMessages,
  paletteIdx = 0,
  onClose,
}: QRProfileCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { data: branding } = useSiteBranding();
  const appName = branding?.appName ?? "vooi.lol";

  const [avatarDataUrl, setAvatarDataUrl] = useState<string | null>(null);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);

  const p = PALETTES[paletteIdx % PALETTES.length];

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

  const publicUrl = `${window.location.origin}/@${username}`;
  const publicUrlShort = publicUrl.replace(/^https?:\/\//, "");

  const initials = (displayName || username || "?")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const generate = async (): Promise<string | null> => {
    if (!cardRef.current) return null;
    setIsGenerating(true);
    try {
      return await toPng(cardRef.current, { pixelRatio: 3, cacheBust: true });
    } catch (e) {
      console.error("[qr-card] Failed to generate image:", e);
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
    a.download = `${appName.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-qr-${username}.png`;
    a.click();
  };

  const handleShare = async () => {
    const url = await generate();
    if (!url) return;
    const slug = appName.replace(/[^a-z0-9]/gi, "-").toLowerCase();
    try {
      const blob = await (await fetch(url)).blob();
      const file = new File([blob], `${slug}-${username}.png`, {
        type: "image/png",
      });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: appName,
          text: `Kirimi ${displayName || username} pesan anonim! ${publicUrl}`,
        });
      } else {
        const a = document.createElement("a");
        a.href = url;
        a.download = `${slug}-qr-${username}.png`;
        a.click();
      }
    } catch (e) {
      console.error("[qr-card] Failed to share:", e);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs space-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between text-white px-1">
          <span className="text-sm font-semibold opacity-80">
            Kartu QR Profil
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
            borderRadius: 6,
            overflow: "hidden",
            width: "100%",
            fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
          }}
        >
          {/* ── Zone 1: Dark header ── */}
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
                Profil Anonim
              </span>
            </div>
            <span
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.40)",
                fontWeight: 500,
              }}
            >
              {appName}
            </span>
          </div>

          {/* ── Zone 2: Profile + QR body ── */}
          <div
            style={{
              background: "#ffffff",
              padding: "22px 20px 18px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
            }}
          >
            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              {avatarDataUrl ? (
                <img
                  src={avatarDataUrl}
                  alt={displayName || username}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: `3px solid ${p.accent}`,
                    display: "block",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: p.avatarBg,
                    color: p.avatarColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    fontWeight: 800,
                    border: `3px solid ${p.accent}`,
                  }}
                >
                  {initials}
                </div>
              )}
              {/* Online / "scan me" pulse ring */}
              <div
                style={{
                  position: "absolute",
                  inset: -4,
                  borderRadius: "50%",
                  border: `2px solid ${p.accentBorder}`,
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Name + username */}
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#09090b",
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {displayName || username}
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: p.ctaColor,
                  margin: "3px 0 0",
                  fontWeight: 600,
                }}
              >
                @{username}
              </p>
              {bio && (
                <p
                  style={{
                    fontSize: 11,
                    color: "#71717a",
                    margin: "6px 0 0",
                    lineHeight: 1.5,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    maxWidth: 220,
                  }}
                >
                  {bio}
                </p>
              )}
              {totalMessages > 0 && (
                <p
                  style={{
                    fontSize: 11,
                    color: "#a1a1aa",
                    margin: "5px 0 0",
                    fontWeight: 500,
                  }}
                >
                  {totalMessages.toLocaleString("id-ID")} pesan masuk
                </p>
              )}
            </div>

            {/* QR Code */}
            <div
              style={{
                background: "#ffffff",
                padding: 12,
                borderRadius: 6,
                border: `1px solid ${p.accentBorder}`,
                boxShadow: `0 0 0 5px ${p.qrRing}`,
              }}
            >
              <QRCodeSVG
                value={publicUrl}
                size={136}
                bgColor="#ffffff"
                fgColor={p.qrFg}
                level="M"
              />
            </div>

            {/* CTA text */}
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: p.ctaColor,
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                Kirimi aku pesan anonim!
              </p>
              <p style={{ fontSize: 11, color: "#71717a", margin: "4px 0 0" }}>
                Scan QR atau kunjungi
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: "#94a3b8",
                  fontWeight: 600,
                  margin: "2px 0 0",
                }}
              >
                {publicUrlShort}
              </p>
            </div>

            {/* 100% Anonim pill */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: p.stripBg,
                border: `1px solid ${p.accentBorder}`,
                borderRadius: 4,
                padding: "5px 12px",
              }}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke={p.ctaColor}
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
                  fontWeight: 700,
                  color: p.ctaColor,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                }}
              >
                100% Anonim
              </span>
            </div>
          </div>

          {/* ── Zone 3: Footer branding ── */}
          <div
            style={{
              padding: "9px 18px",
              background: "#0f172a",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.35)",
                fontWeight: 500,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: 130,
              }}
            >
              {publicUrlShort}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
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
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.75)",
                }}
              >
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
