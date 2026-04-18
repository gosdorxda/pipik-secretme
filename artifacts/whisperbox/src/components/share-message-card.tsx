import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Download, Share, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const PALETTES = [
  {
    stripe: "linear-gradient(to right, #86ead4, #60c4ae)",
    avatarBg: "#ddf9f2", avatarColor: "#0d4038",
    anonBg: "#f0fefa", anonColor: "#0d7062",
    accentText: "#0d7062",
  },
  {
    stripe: "linear-gradient(to right, #a5b4fc, #818cf8)",
    avatarBg: "#ede9fe", avatarColor: "#3730a3",
    anonBg: "#f5f3ff", anonColor: "#4f46e5",
    accentText: "#4f46e5",
  },
  {
    stripe: "linear-gradient(to right, #93c5fd, #60a5fa)",
    avatarBg: "#dbeafe", avatarColor: "#1e3a5f",
    anonBg: "#eff6ff", anonColor: "#1d4ed8",
    accentText: "#1d4ed8",
  },
  {
    stripe: "linear-gradient(to right, #fcd34d, #86ead4)",
    avatarBg: "#fef3c7", avatarColor: "#713f12",
    anonBg: "#fffbeb", anonColor: "#92400e",
    accentText: "#92400e",
  },
];

type ShareMessageCardProps = {
  messageId: string;
  content: string;
  createdAt: string;
  ownerReply?: string | null;
  paletteIdx: number;
  displayName: string;
  username: string;
  totalMessages?: number;
  onClose: () => void;
};

export function ShareMessageCard({
  content,
  createdAt,
  paletteIdx,
  displayName,
  username,
  totalMessages = 0,
  onClose,
}: ShareMessageCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const p = PALETTES[paletteIdx % PALETTES.length];

  const initials = (displayName || username || "?")
    .split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);

  const publicUrl = `whisperbox.app/u/${username}`;
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  const truncated = content.length > 300 ? content.slice(0, 297) + "…" : content;

  const generate = async (): Promise<string | null> => {
    if (!cardRef.current) return null;
    setIsGenerating(true);
    try {
      return await toPng(cardRef.current, { pixelRatio: 3, cacheBust: true });
    } catch (e) {
      console.error(e);
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
    a.download = "whisperbox-message.png";
    a.click();
  };

  const handleShare = async () => {
    const url = await generate();
    if (!url) return;
    try {
      const blob = await (await fetch(url)).blob();
      const file = new File([blob], "whisperbox-message.png", { type: "image/png" });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "WhisperBox",
          text: `Kirim pesan anonim ke ${displayName} di ${publicUrl}`,
        });
      } else {
        const a = document.createElement("a");
        a.href = url;
        a.download = "whisperbox-message.png";
        a.click();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="w-full max-w-sm space-y-3" onClick={e => e.stopPropagation()}>

        {/* Modal header */}
        <div className="flex items-center justify-between text-white px-1">
          <span className="text-sm font-semibold opacity-80">Preview Gambar</span>
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
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          {/* Accent stripe */}
          <div style={{ height: 4, background: p.stripe }} />

          {/* ── Header ── */}
          <div style={{
            padding: "18px 22px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            borderBottom: "1px solid #f4f4f5",
          }}>
            {/* Avatar initials */}
            <div style={{
              width: 46,
              height: 46,
              borderRadius: "50%",
              background: p.avatarBg,
              color: p.avatarColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 17,
              fontWeight: 800,
              flexShrink: 0,
              border: "2px solid rgba(0,0,0,0.04)",
            }}>
              {initials}
            </div>

            {/* Name + username */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#09090b",
                margin: 0,
                lineHeight: 1.3,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
                {displayName || username}
              </p>
              <p style={{
                fontSize: 12,
                color: "#71717a",
                margin: "3px 0 0",
                lineHeight: 1,
              }}>
                @{username}
              </p>
            </div>

            {/* Messages received */}
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{
                fontSize: 24,
                fontWeight: 900,
                color: "#09090b",
                margin: 0,
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}>
                {totalMessages}
              </p>
              <p style={{
                fontSize: 10,
                color: "#a1a1aa",
                margin: "3px 0 0",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontWeight: 600,
              }}>
                pesan masuk
              </p>
            </div>
          </div>

          {/* ── Message body ── */}
          <div style={{ padding: "20px 22px 22px" }}>

            {/* Anonim sender row */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 14,
            }}>
              <div style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: p.anonBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke={p.anonColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: p.anonColor }}>Anonim</span>
              <span style={{
                display: "inline-block",
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: p.anonColor,
                opacity: 0.4,
                marginLeft: 1,
                alignSelf: "center",
              }} />
              <span style={{ fontSize: 11, color: "#a1a1aa", marginLeft: "auto" }}>{timeAgo}</span>
            </div>

            {/* Message text */}
            <p style={{
              fontSize: 17,
              fontWeight: 450,
              lineHeight: 1.7,
              color: "#18181b",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              margin: 0,
            }}>
              {truncated}
            </p>
          </div>

          {/* ── Footer branding ── */}
          <div style={{
            padding: "11px 22px",
            background: "#f9fafb",
            borderTop: "1px solid #f4f4f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <p style={{ fontSize: 11, color: "#a1a1aa", margin: 0, lineHeight: 1.4 }}>
              Kirim pesan anonim di{" "}
              <span style={{ fontWeight: 600, color: "#71717a" }}>{publicUrl}</span>
            </p>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              flexShrink: 0,
              marginLeft: 12,
            }}>
              <div style={{
                width: 17,
                height: 17,
                borderRadius: 5,
                background: "#86ead4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <span style={{ fontSize: 9, fontWeight: 900, color: "#0d4038" }}>W</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#18181b" }}>WhisperBox</span>
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
