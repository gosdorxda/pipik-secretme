import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Download, Share, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { resolveAvatarUrl } from "@/lib/avatar";

const PALETTES = [
  { headerBg: "rgba(134,234,212,0.18)", headerBorder: "rgba(134,234,212,0.35)", avatarBg: "#c6f6ed", avatarColor: "#0d4038" },
  { headerBg: "rgba(165,180,252,0.18)", headerBorder: "rgba(165,180,252,0.35)", avatarBg: "#ddd6fe", avatarColor: "#3730a3" },
  { headerBg: "rgba(147,197,253,0.18)", headerBorder: "rgba(147,197,253,0.35)", avatarBg: "#bfdbfe", avatarColor: "#1e3a5f" },
  { headerBg: "rgba(252,211,77,0.18)",  headerBorder: "rgba(252,211,77,0.35)",  avatarBg: "#fde68a", avatarColor: "#713f12" },
];

type ShareMessageCardProps = {
  messageId: string;
  content: string;
  createdAt: string;
  ownerReply?: string | null;
  paletteIdx: number;
  displayName: string;
  username: string;
  avatarUrl?: string | null;
  totalMessages?: number;
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
  const p = PALETTES[paletteIdx % PALETTES.length];

  const initials = (displayName || username || "?")
    .split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);

  const publicUrl = `whisperbox.app/@${username}`;
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  const truncated = content.length > 320 ? content.slice(0, 317) + "…" : content;

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
          text: `Kirim pesan anonim ke ${displayName || username} di ${publicUrl}`,
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
            borderRadius: 8,
            overflow: "hidden",
            width: "100%",
            fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
          }}
        >
          {/* ── Header: tinted bg matching palette ── */}
          <div style={{
            padding: "18px 22px",
            background: p.headerBg,
            borderBottom: `1px solid ${p.headerBorder}`,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}>
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
              }}>
                {initials}
              </div>
            )}

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

            {/* Timestamp (when message was received) */}
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{
                fontSize: 12,
                color: "#71717a",
                margin: 0,
                lineHeight: 1.4,
                fontWeight: 500,
              }}>
                {timeAgo}
              </p>
            </div>
          </div>

          {/* ── Message body ── */}
          <div style={{ padding: "22px 22px 24px" }}>
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
