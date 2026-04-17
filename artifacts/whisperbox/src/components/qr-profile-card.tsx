import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Download, Share2, X } from "lucide-react";

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
  totalMessages,
  onClose,
}: QRProfileCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const publicUrl = `${window.location.origin}/u/${username}`;
  const shortUrl = publicUrl.replace("https://", "").replace("http://", "");

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
      const file = new File([blob], `whisperbox-${username}.png`, { type: "image/png" });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "WhisperBox", text: `Kirimi ${displayName} pesan anonim!` });
      } else {
        const a = document.createElement("a");
        a.href = url;
        a.download = `whisperbox-qr-${username}.png`;
        a.click();
      }
    } catch {}
  };

  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="w-full max-w-xs space-y-4" onClick={(e) => e.stopPropagation()}>

        <div className="flex items-center justify-between text-white">
          <span className="text-sm font-semibold">Preview Kartu QR</span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* The card that gets captured */}
        <div
          ref={cardRef}
          style={{
            width: "100%",
            fontFamily: "'DM Sans', system-ui, sans-serif",
            background: "linear-gradient(145deg, #f0fdf9 0%, #ddf9f2 40%, #c6f2e7 100%)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Top bar */}
          <div style={{
            background: "linear-gradient(135deg, #0f2e28 0%, #1a443c 100%)",
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <div style={{
              width: 20, height: 20,
              background: "rgba(134,234,212,0.2)",
              border: "1px solid rgba(134,234,212,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#86ead4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <span style={{ color: "#86ead4", fontSize: "11px", fontWeight: 700, letterSpacing: "0.07em" }}>WHISPERBOX</span>
          </div>

          {/* Hero text */}
          <div style={{ padding: "24px 20px 16px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#3a9e88", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>
              Kirimi pesan anonim ke
            </p>
            <p style={{ fontSize: "26px", fontWeight: 800, color: "#0f2e28", lineHeight: 1.1, marginBottom: "4px" }}>
              {displayName}
            </p>
            <p style={{ fontSize: "13px", color: "#3a9e88", fontWeight: 600 }}>@{username}</p>
            {bio && (
              <p style={{ fontSize: "12px", color: "#52a88d", marginTop: "6px", lineHeight: 1.45, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                {bio}
              </p>
            )}
          </div>

          {/* Avatar + stat + QR */}
          <div style={{ padding: "0 20px 24px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
            {/* Left: avatar + stat */}
            <div style={{ flex: 1 }}>
              <div style={{
                width: 56, height: 56,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #86ead4 0%, #1a443c 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: "22px", fontWeight: 800,
                border: "3px solid rgba(26,68,60,0.15)",
                marginBottom: "14px",
              }}>
                {initials}
              </div>

              {totalMessages > 0 && (
                <div style={{
                  background: "rgba(26,68,60,0.07)",
                  border: "1px solid rgba(26,68,60,0.12)",
                  padding: "10px 12px",
                  marginBottom: "12px",
                }}>
                  <p style={{ fontSize: "28px", fontWeight: 800, color: "#0f2e28", lineHeight: 1, margin: 0 }}>
                    {totalMessages.toLocaleString("id-ID")}
                  </p>
                  <p style={{ fontSize: "10px", color: "#52a88d", marginTop: "3px", fontWeight: 600 }}>
                    pesan diterima sepanjang masa
                  </p>
                </div>
              )}

              <div style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                background: "#1a443c", padding: "7px 12px",
              }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#86ead4" strokeWidth="2.5" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span style={{ fontSize: "10px", fontWeight: 700, color: "#86ead4", letterSpacing: "0.04em" }}>
                  100% ANONIM
                </span>
              </div>
            </div>

            {/* Right: QR */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <div style={{
                background: "#fff",
                padding: "10px",
                boxShadow: "0 2px 12px rgba(26,68,60,0.15)",
                border: "1px solid rgba(26,68,60,0.1)",
              }}>
                <QRCodeSVG
                  value={publicUrl}
                  size={110}
                  bgColor="#ffffff"
                  fgColor="#0f2e28"
                  level="M"
                />
              </div>
              <p style={{ fontSize: "9px", color: "#52a88d", textAlign: "center", maxWidth: "130px", lineHeight: 1.3, fontWeight: 500 }}>
                Scan QR atau kunjungi<br />
                <strong style={{ color: "#1a443c" }}>{shortUrl}</strong>
              </p>
            </div>
          </div>

          {/* Bottom decoration */}
          <div style={{
            background: "rgba(26,68,60,0.06)",
            borderTop: "1px solid rgba(26,68,60,0.1)",
            padding: "8px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <p style={{ fontSize: "10px", color: "#52a88d", margin: 0 }}>Bagikan ke stories atau bio-mu</p>
            <p style={{ fontSize: "10px", fontWeight: 700, color: "#1a443c", margin: 0 }}>whisperbox.site</p>
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
            {isGenerating ? "Generating…" : "Download"}
          </Button>
          <Button
            className="flex-1 gap-2"
            onClick={handleShare}
            disabled={isGenerating}
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}
