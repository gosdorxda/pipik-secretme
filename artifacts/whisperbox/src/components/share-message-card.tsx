import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Download, Share2, X } from "lucide-react";

const PALETTES = [
  {
    bg: "linear-gradient(135deg, #86ead4 0%, #5ecfb7 50%, #3ab9a1 100%)",
    quote: "rgba(255,255,255,0.2)",
    text: "#0a2520",
    sub: "rgba(10,37,32,0.6)",
    tag: "rgba(10,37,32,0.12)",
    tagText: "#0a2520",
    logo: "#0a2520",
  },
  {
    bg: "linear-gradient(135deg, #a5b4fc 0%, #818cf8 50%, #6366f1 100%)",
    quote: "rgba(255,255,255,0.2)",
    text: "#1e1b4b",
    sub: "rgba(30,27,75,0.6)",
    tag: "rgba(30,27,75,0.12)",
    tagText: "#1e1b4b",
    logo: "#1e1b4b",
  },
  {
    bg: "linear-gradient(135deg, #93c5fd 0%, #60a5fa 50%, #3b82f6 100%)",
    quote: "rgba(255,255,255,0.2)",
    text: "#1e3a5f",
    sub: "rgba(30,58,95,0.6)",
    tag: "rgba(30,58,95,0.12)",
    tagText: "#1e3a5f",
    logo: "#1e3a5f",
  },
  {
    bg: "linear-gradient(135deg, #fcd34d 0%, #fbbf24 50%, #86ead4 100%)",
    quote: "rgba(255,255,255,0.25)",
    text: "#422006",
    sub: "rgba(66,32,6,0.6)",
    tag: "rgba(66,32,6,0.12)",
    tagText: "#422006",
    logo: "#422006",
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
  onClose: () => void;
};

export function ShareMessageCard({
  content,
  paletteIdx,
  displayName,
  username,
  onClose,
}: ShareMessageCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const p = PALETTES[paletteIdx % PALETTES.length];

  const generate = async (): Promise<string | null> => {
    if (!cardRef.current) return null;
    setIsGenerating(true);
    try {
      const url = await toPng(cardRef.current, {
        pixelRatio: 3,
        cacheBust: true,
      });
      return url;
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
    a.download = `whisperbox-message.png`;
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
          text: "I received an anonymous message on WhisperBox!",
        });
      } else {
        // Fallback: download
        const a = document.createElement("a");
        a.href = url;
        a.download = "whisperbox-message.png";
        a.click();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const publicUrl = `${window.location.origin}/u/${username}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-sm space-y-4" onClick={e => e.stopPropagation()}>

        {/* Close */}
        <div className="flex items-center justify-between text-white">
          <span className="text-sm font-semibold">Preview &amp; Share</span>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* The card that gets captured */}
        <div
          ref={cardRef}
          style={{
            background: p.bg,
            borderRadius: 16,
            padding: "32px 28px 24px",
            position: "relative",
            overflow: "hidden",
            width: "100%",
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
          }}
        >
          {/* Big decorative quote mark */}
          <div style={{
            position: "absolute",
            top: -10,
            left: 12,
            fontSize: 140,
            lineHeight: 1,
            color: p.quote,
            fontFamily: "Georgia, serif",
            userSelect: "none",
            pointerEvents: "none",
          }}>"</div>

          {/* Anonymous tag */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: p.tag,
            borderRadius: 99,
            padding: "4px 12px",
            marginBottom: 16,
            position: "relative",
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: p.tagText, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Anonymous Message
            </span>
          </div>

          {/* Message content */}
          <p style={{
            fontSize: 20,
            fontWeight: 600,
            lineHeight: 1.5,
            color: p.text,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            position: "relative",
            marginBottom: 28,
            maxHeight: 200,
            overflow: "hidden",
          }}>
            {content.length > 200 ? content.slice(0, 197) + "…" : content}
          </p>

          {/* Footer */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${p.tag}`,
            paddingTop: 16,
          }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: p.text, margin: 0 }}>{displayName}</p>
              <p style={{ fontSize: 11, color: p.sub, margin: 0 }}>{publicUrl}</p>
            </div>
            <div style={{
              background: p.tag,
              borderRadius: 8,
              padding: "4px 10px",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}>
              <div style={{
                width: 16,
                height: 16,
                background: p.logo,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: p.bg.includes("#86ead4") ? "#fff" : "#fff" }}>W</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: p.text }}>WhisperBox</span>
            </div>
          </div>
        </div>

        {/* Actions */}
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
