import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Download, Share, X } from "lucide-react";
import { resolveAvatarUrl } from "@/lib/avatar";

type QRProfileCardProps = {
  displayName: string;
  username: string;
  bio?: string | null;
  avatarUrl?: string | null;
  totalMessages: number;
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

  const publicUrl = `${window.location.origin}/@${username}`;
  const shortUrl = `whisperbox.app/@${username}`;

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
    a.download = `whisperbox-qr-${username}.png`;
    a.click();
  };

  const handleShare = async () => {
    const url = await generate();
    if (!url) return;
    try {
      const blob = await (await fetch(url)).blob();
      const file = new File([blob], `whisperbox-${username}.png`, {
        type: "image/png",
      });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "WhisperBox",
          text: `Kirimi ${displayName || username} pesan anonim! ${shortUrl}`,
        });
      } else {
        const a = document.createElement("a");
        a.href = url;
        a.download = `whisperbox-qr-${username}.png`;
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
            borderRadius: 8,
            overflow: "hidden",
            width: "100%",
            fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
          }}
        >
          {/* ── Header: mint tint ── */}
          <div
            style={{
              padding: "18px 20px",
              background: "rgba(134,234,212,0.18)",
              borderBottom: "1px solid rgba(134,234,212,0.35)",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            {/* Avatar */}
            {resolveAvatarUrl(avatarUrl) ? (
              <img
                src={resolveAvatarUrl(avatarUrl)!}
                alt={displayName || username}
                crossOrigin="anonymous"
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
            ) : (
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  background: "#c6f6ed",
                  color: "#0d4038",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 17,
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>
            )}

            {/* Name + username */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: 15,
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
                  fontSize: 12,
                  color: "#52a88d",
                  margin: "3px 0 0",
                  lineHeight: 1,
                  fontWeight: 500,
                }}
              >
                @{username}
              </p>
            </div>

            {/* Message count */}
            {totalMessages > 0 && (
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p
                  style={{
                    fontSize: 22,
                    fontWeight: 900,
                    color: "#09090b",
                    margin: 0,
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {totalMessages.toLocaleString("id-ID")}
                </p>
                <p
                  style={{
                    fontSize: 10,
                    color: "#52a88d",
                    margin: "3px 0 0",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    fontWeight: 600,
                  }}
                >
                  pesan masuk
                </p>
              </div>
            )}
          </div>

          {/* ── Bio (if any) ── */}
          {bio && (
            <div
              style={{
                padding: "12px 20px 0",
                borderBottom: "none",
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  color: "#52525b",
                  lineHeight: 1.55,
                  margin: 0,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {bio}
              </p>
            </div>
          )}

          {/* ── QR Code body ── */}
          <div
            style={{
              padding: bio ? "16px 20px 20px" : "24px 20px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
            }}
          >
            {/* QR wrapper */}
            <div
              style={{
                background: "#ffffff",
                padding: 12,
                borderRadius: 12,
                border: "1px solid rgba(134,234,212,0.4)",
                boxShadow: "0 0 0 4px rgba(134,234,212,0.12)",
              }}
            >
              <QRCodeSVG
                value={publicUrl}
                size={140}
                bgColor="#ffffff"
                fgColor="#0f2e28"
                level="M"
              />
            </div>

            {/* CTA text */}
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#09090b",
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
                  fontSize: 12,
                  color: "#0d7062",
                  fontWeight: 700,
                  margin: "2px 0 0",
                }}
              >
                {shortUrl}
              </p>
            </div>

            {/* 100% Anonim pill */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: "rgba(134,234,212,0.15)",
                border: "1px solid rgba(134,234,212,0.35)",
                borderRadius: 99,
                padding: "5px 12px",
              }}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0d7062"
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
                  color: "#0d7062",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                }}
              >
                100% Anonim
              </span>
            </div>
          </div>

          {/* ── Footer branding ── */}
          <div
            style={{
              padding: "10px 20px",
              background: "#f9fafb",
              borderTop: "1px solid #f4f4f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p style={{ fontSize: 11, color: "#a1a1aa", margin: 0 }}>
              Bagikan ke stories atau bio-mu
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div
                style={{
                  width: 17,
                  height: 17,
                  borderRadius: 5,
                  background: "#86ead4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{ fontSize: 9, fontWeight: 900, color: "#0d4038" }}
                >
                  W
                </span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#18181b" }}>
                WhisperBox
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
