import { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Download, Share, X, Lock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { resolveAvatarUrl, fetchAsDataUrl } from "@/lib/avatar";
import { useSiteBranding } from "@/hooks/use-branding";

type CardData = {
  displayName: string;
  username: string;
  initials: string;
  avatarDataUrl: string | null;
  logoDataUrl: string | null;
  appName: string;
  content: string;
  timeAgo: string;
  publicUrl: string;
  totalMessages: number;
};

function Avatar({
  src,
  initials,
  size,
  bg,
  color,
  border,
}: {
  src: string | null;
  initials: string;
  size: number;
  bg: string;
  color: string;
  border?: string;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={initials}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          display: "block",
          border: border ?? "none",
          flexShrink: 0,
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.33,
        fontWeight: 800,
        flexShrink: 0,
        border: border ?? "none",
      }}
    >
      {initials}
    </div>
  );
}

function AppLogo({
  src,
  appName,
  size = 14,
  color = "#0e9f8e",
}: {
  src: string | null;
  appName: string;
  size?: number;
  color?: string;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={appName}
        style={{ width: size, height: size, borderRadius: 3, flexShrink: 0 }}
      />
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ borderRadius: 3, flexShrink: 0 }}
    >
      <rect width="160" height="160" rx="36" fill={color} />
      <path
        d="M32 44C32 37.373 37.373 32 44 32H116C122.627 32 128 37.373 128 44V92C128 98.627 122.627 104 116 104H90L80 124L70 104H44C37.373 104 32 98.627 32 92V44Z"
        fill="white"
      />
      <circle cx="60" cy="68" r="7" fill={color} />
      <circle cx="80" cy="68" r="7" fill={color} />
      <circle cx="100" cy="68" r="7" fill={color} />
    </svg>
  );
}

function CardCleanUI({ d }: { d: CardData }) {
  return (
    <div
      style={{
        width: "100%",
        background: "#ffffff",
        borderRadius: 6,
        fontFamily: "'DM Sans', system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #edfaf7 0%, #d8f3ed 100%)",
          padding: "13px 16px 15px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderBottom: "1px solid #c2e9e1",
        }}
      >
        <Avatar
          src={d.avatarDataUrl}
          initials={d.initials}
          size={44}
          bg="#c2e9e1"
          color="#0a7c6e"
          border="2px solid #0e9f8e"
        />
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#0a5c55",
              lineHeight: 1.2,
            }}
          >
            {d.displayName || d.username}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#4aaa9a",
              marginTop: 2,
            }}
          >
            @{d.username}
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 16px 14px" }}>
        <div
          style={{
            background: "#f6fbfa",
            border: "1px solid #d4ede9",
            borderRadius: 12,
            padding: "14px 14px 14px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: "#e6f4f2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Lock size={11} color="#0e9f8e" />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#0e9f8e" }}>
              Anonim
            </span>
            <span
              style={{ fontSize: 11, color: "#aab5be", marginLeft: "auto" }}
            >
              {d.timeAgo}
            </span>
          </div>

          <p
            style={{
              fontSize: 16,
              color: "#1a2730",
              lineHeight: 1.65,
              margin: "0 0 12px",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {d.content}
          </p>
        </div>
      </div>

      <div
        style={{
          padding: "10px 16px 14px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          borderTop: "1px solid #eef1f4",
        }}
      >
        <AppLogo src={d.logoDataUrl} appName={d.appName} size={15} />
        <span style={{ fontSize: 11, color: "#9aabb8" }}>dibagikan via</span>
        <span style={{ fontSize: 12, fontWeight: 800, color: "#0e9f8e" }}>
          {d.appName}
        </span>
      </div>
    </div>
  );
}

function CardVibrantGlow({ d }: { d: CardData }) {
  return (
    <div
      style={{
        width: "100%",
        background:
          "linear-gradient(145deg, #6c3de8 0%, #c026d3 55%, #f97316 100%)",
        borderRadius: 6,
        padding: "26px 22px 22px",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -80,
          left: "50%",
          transform: "translateX(-50%)",
          width: 260,
          height: 260,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.13) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 80,
            height: 80,
            marginBottom: 14,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: -5,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.25)",
              filter: "blur(6px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: -3,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.4)",
            }}
          />
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px solid white",
            }}
          >
            <Avatar
              src={d.avatarDataUrl}
              initials={d.initials}
              size={80}
              bg="rgba(255,255,255,0.3)"
              color="white"
            />
          </div>
        </div>

        <div
          style={{
            color: "rgba(255,255,255,0.65)",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 3,
          }}
        >
          pesan untuk
        </div>
        <div
          style={{
            color: "white",
            fontSize: 18,
            fontWeight: 800,
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: 3,
            textShadow: "0 1px 8px rgba(0,0,0,0.2)",
          }}
        >
          {d.displayName || d.username}
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: 12,
            fontWeight: 500,
            marginBottom: 20,
          }}
        >
          @{d.username}
        </div>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.14)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 16,
          padding: "16px 16px 14px",
          backdropFilter: "blur(8px)",
          position: "relative",
          zIndex: 1,
          marginBottom: 16,
        }}
      >
        <p
          style={{
            color: "white",
            fontSize: 15,
            lineHeight: 1.7,
            margin: 0,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            textShadow: "0 1px 4px rgba(0,0,0,0.15)",
          }}
        >
          {d.content}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <AppLogo
            src={d.logoDataUrl}
            appName={d.appName}
            size={14}
            color="rgba(255,255,255,0.7)"
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            {d.appName}
          </span>
        </div>
      </div>
    </div>
  );
}

function CardDarkSlate({ d }: { d: CardData }) {
  return (
    <div
      style={{
        width: "100%",
        background: "#111827",
        borderRadius: 6,
        fontFamily: "'DM Sans', system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: 4,
          background:
            "linear-gradient(90deg, #0e9f8e 0%, #06b6d4 50%, #6c3de8 100%)",
        }}
      />

      <div style={{ padding: "20px 20px 18px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <div
            style={{
              position: "relative",
              flexShrink: 0,
            }}
          >
            <Avatar
              src={d.avatarDataUrl}
              initials={d.initials}
              size={46}
              bg="#1f2937"
              color="#0e9f8e"
              border="2px solid #0e9f8e"
            />
            <div
              style={{
                position: "absolute",
                bottom: -1,
                right: -1,
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: "#111827",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Lock size={8} color="#6b7280" />
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#f9fafb",
                lineHeight: 1.2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {d.displayName || d.username}
            </div>
            <div style={{ fontSize: 11.5, color: "#6b7280", marginTop: 2 }}>
              @{d.username}
            </div>
          </div>
          <div
            style={{
              flexShrink: 0,
              background: "#1f2937",
              border: "1px solid #374151",
              borderRadius: 6,
              padding: "4px 9px",
            }}
          >
            <div style={{ fontSize: 9, color: "#6b7280", marginBottom: 1 }}>
              ANONIM
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#0e9f8e" }}>
              🔒 tersembunyi
            </div>
          </div>
        </div>

        <div
          style={{
            background: "#1f2937",
            border: "1px solid #374151",
            borderRadius: 12,
            padding: "16px",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              fontSize: 32,
              color: "#0e9f8e",
              lineHeight: 0.8,
              marginBottom: 8,
              opacity: 0.7,
              fontFamily: "Georgia, serif",
            }}
          >
            "
          </div>
          <p
            style={{
              fontSize: 15,
              color: "#e5e7eb",
              lineHeight: 1.7,
              margin: 0,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {d.content}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <AppLogo
              src={d.logoDataUrl}
              appName={d.appName}
              size={14}
              color="#0e9f8e"
            />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280" }}>
              {d.appName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardGlassMorph({ d }: { d: CardData }) {
  return (
    <div
      style={{
        width: "100%",
        background:
          "linear-gradient(135deg, #0ea5e9 0%, #7c3aed 50%, #db2777 100%)",
        borderRadius: 6,
        padding: "26px 20px 20px",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: -60,
          right: -60,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.07)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -40,
          left: -40,
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 18,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            padding: 3,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.3)",
          }}
        >
          <Avatar
            src={d.avatarDataUrl}
            initials={d.initials}
            size={52}
            bg="rgba(255,255,255,0.25)"
            color="white"
          />
        </div>
        <div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "white",
              lineHeight: 1.2,
              textShadow: "0 1px 6px rgba(0,0,0,0.15)",
            }}
          >
            {d.displayName || d.username}
          </div>
          <div
            style={{
              fontSize: 11.5,
              color: "rgba(255,255,255,0.68)",
              marginTop: 2,
            }}
          >
            @{d.username}
          </div>
        </div>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.18)",
          border: "1px solid rgba(255,255,255,0.28)",
          borderRadius: 16,
          padding: "16px 16px 14px",
          backdropFilter: "blur(12px)",
          position: "relative",
          zIndex: 1,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Lock size={10} color="rgba(255,255,255,0.85)" />
          </div>
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 600,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            Seseorang anonim
          </span>
          <span
            style={{
              fontSize: 10.5,
              color: "rgba(255,255,255,0.5)",
              marginLeft: "auto",
            }}
          >
            {d.timeAgo}
          </span>
        </div>
        <p
          style={{
            color: "white",
            fontSize: 15,
            lineHeight: 1.7,
            margin: 0,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            textShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          {d.content}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          position: "relative",
          zIndex: 1,
        }}
      >
        <AppLogo
          src={d.logoDataUrl}
          appName={d.appName}
          size={14}
          color="rgba(255,255,255,0.7)"
        />
        <span
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.65)",
          }}
        >
          dibagikan via
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: "rgba(255,255,255,0.9)",
          }}
        >
          {d.appName}
        </span>
      </div>
    </div>
  );
}

const TEMPLATES = [
  { id: "clean-ui", label: "Bersih", dot: "#0e9f8e", bg: "#f6fbfa" },
  { id: "vibrant-glow", label: "Glow", dot: "#c026d3", bg: "#6c3de8" },
  { id: "dark-slate", label: "Gelap", dot: "#374151", bg: "#111827" },
  { id: "glass-morph", label: "Glass", dot: "#7c3aed", bg: "#0ea5e9" },
] as const;

type TemplateId = (typeof TEMPLATES)[number]["id"];

type ShareMessageCardProps = {
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
  displayName,
  username,
  avatarUrl,
  totalMessages = 0,
  onClose,
}: ShareMessageCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateId>("clean-ui");
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
    content.length > 300 ? content.slice(0, 297) + "…" : content;

  const cardData: CardData = {
    displayName,
    username,
    initials,
    avatarDataUrl,
    logoDataUrl,
    appName,
    content: truncated,
    timeAgo,
    publicUrl,
    totalMessages,
  };

  const generate = async (): Promise<string | null> => {
    if (!cardRef.current) return null;
    setIsGenerating(true);
    try {
      return await toPng(cardRef.current, { pixelRatio: 3, cacheBust: true });
    } catch (e) {
      console.error("[share-card] Failed to generate image:", e);
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
    } catch (e) {
      console.error("[share-card] Failed to share:", e);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm flex flex-col gap-3 p-4 pb-6 sm:pb-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between text-white px-1">
          <span className="text-sm font-semibold opacity-80">
            Pilih template
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-2 px-1">
          {TEMPLATES.map((tpl) => {
            const isActive = selectedTemplate === tpl.id;
            return (
              <button
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl.id)}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                  padding: "7px 0",
                  borderRadius: 8,
                  border: isActive
                    ? `2px solid ${tpl.dot}`
                    : "2px solid rgba(255,255,255,0.15)",
                  background: isActive ? tpl.bg : "rgba(255,255,255,0.08)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: tpl.dot,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: isActive ? tpl.dot : "rgba(255,255,255,0.65)",
                  }}
                >
                  {tpl.label}
                </span>
              </button>
            );
          })}
        </div>

        <div ref={cardRef}>
          {selectedTemplate === "clean-ui" && <CardCleanUI d={cardData} />}
          {selectedTemplate === "vibrant-glow" && (
            <CardVibrantGlow d={cardData} />
          )}
          {selectedTemplate === "dark-slate" && <CardDarkSlate d={cardData} />}
          {selectedTemplate === "glass-morph" && (
            <CardGlassMorph d={cardData} />
          )}
        </div>

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
