import { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Download, Share, X, Lock } from "lucide-react";
import { resolveAvatarUrl, fetchAsDataUrl } from "@/lib/avatar";
import { useSiteBranding } from "@/hooks/use-branding";

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
  onClose,
}: QRProfileCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { data: branding } = useSiteBranding();
  const appName = branding?.appName ?? "kepoin.me";

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
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs flex flex-col gap-3 p-4 pb-6 sm:pb-4"
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

        {/* Card that gets captured */}
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
          {/* Teal gradient header */}
          <div
            style={{
              background: "linear-gradient(135deg, #0e9f8e 0%, #0b8a7a 100%)",
              padding: "20px 20px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                position: "relative",
                marginBottom: 12,
              }}
            >
              {avatarDataUrl ? (
                <img
                  src={avatarDataUrl}
                  alt={displayName || username}
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid rgba(255,255,255,0.9)",
                    display: "block",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.25)",
                    border: "3px solid rgba(255,255,255,0.9)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    fontWeight: 800,
                    color: "white",
                  }}
                >
                  {initials}
                </div>
              )}
            </div>

            {/* Name + username */}
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: "white",
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {displayName || username}
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.75)",
                  margin: "3px 0 0",
                  fontWeight: 500,
                }}
              >
                @{username}
              </p>
              {totalMessages > 0 && (
                <p
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.6)",
                    margin: "4px 0 0",
                  }}
                >
                  {totalMessages.toLocaleString("id-ID")} pesan diterima
                </p>
              )}
            </div>
          </div>

          {/* White body — QR + CTA */}
          <div
            style={{
              padding: "20px 20px 16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
            }}
          >
            {bio && (
              <p
                style={{
                  fontSize: 12,
                  color: "#556070",
                  margin: 0,
                  lineHeight: 1.5,
                  textAlign: "center",
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

            {/* QR Code */}
            <div
              style={{
                background: "#ffffff",
                padding: 12,
                borderRadius: 12,
                border: "1px solid #eef1f4",
                boxShadow: "0 4px 16px rgba(14,159,142,0.12)",
              }}
            >
              <QRCodeSVG
                value={publicUrl}
                size={136}
                bgColor="#ffffff"
                fgColor="#0b2e2a"
                level="M"
              />
            </div>

            {/* CTA text */}
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#0e9f8e",
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                Kirimi aku pesan anonim!
              </p>
              <p style={{ fontSize: 11, color: "#9aabb8", margin: "4px 0 0" }}>
                Scan QR atau kunjungi
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: "#9aabb8",
                  fontWeight: 600,
                  margin: "2px 0 0",
                }}
              >
                {publicUrlShort}
              </p>
            </div>

            {/* Anonymity badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: "#eef9f7",
                border: "1px solid #c5eae5",
                borderRadius: 100,
                padding: "5px 14px",
              }}
            >
              <Lock size={10} color="#0e9f8e" />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#0e9f8e",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                }}
              >
                100% Anonim
              </span>
            </div>
          </div>

          {/* Branding footer */}
          <div
            style={{
              padding: "10px 18px",
              background: "#f8fafb",
              borderTop: "1px solid #eef1f4",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p
              style={{
                fontSize: 10,
                color: "#aab5be",
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "55%",
              }}
            >
              {publicUrlShort}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              {logoDataUrl ? (
                <img
                  src={logoDataUrl}
                  alt={appName}
                  style={{ width: 15, height: 15, borderRadius: 3 }}
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
                  <rect width="160" height="160" rx="36" fill="#0e9f8e" />
                  <path
                    d="M32 44C32 37.373 37.373 32 44 32H116C122.627 32 128 37.373 128 44V92C128 98.627 122.627 104 116 104H90L80 124L70 104H44C37.373 104 32 98.627 32 92V44Z"
                    fill="white"
                  />
                  <circle cx="60" cy="68" r="7" fill="#0e9f8e" />
                  <circle cx="80" cy="68" r="7" fill="#0e9f8e" />
                  <circle cx="100" cy="68" r="7" fill="#0e9f8e" />
                </svg>
              )}
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: "#0e9f8e",
                }}
              >
                {appName}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 px-1">
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
