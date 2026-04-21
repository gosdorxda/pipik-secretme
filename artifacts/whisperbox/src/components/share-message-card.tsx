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
};

function CardSageGarden({ d }: { d: CardData }) {
  return (
    <div
      style={{
        width: "100%",
        background:
          "linear-gradient(160deg, #0b2218 0%, #163824 55%, #0d2e1c 100%)",
        borderRadius: 6,
        padding: "28px 24px 22px",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 6,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(160,210,130,0.09) 0%, transparent 60%)",
        }}
      />
      {/* ZONE 1 — Recipient */}
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
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 100,
            padding: "4px 12px",
            marginBottom: 22,
          }}
        >
          <Lock size={10} color="#8aba7e" />
          <span
            style={{
              color: "#8aba7e",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
            }}
          >
            PESAN ANONIM
          </span>
        </div>

        {/* Avatar */}
        <div
          style={{
            position: "relative",
            marginBottom: 14,
            width: 88,
            height: 88,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: -4,
              borderRadius: "50%",
              background:
                "conic-gradient(#c9a84c 0%, #f0d878 40%, #c9a84c 70%, #a8862e 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: -1,
              borderRadius: "50%",
              background: "#0d2e1c",
            }}
          />
          {d.avatarDataUrl ? (
            <img
              src={d.avatarDataUrl}
              alt={d.displayName}
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #2a5438 0%, #1c3d28 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 800,
                color: "#c9a84c",
              }}
            >
              {d.initials}
            </div>
          )}
        </div>

        <div
          style={{
            color: "rgba(165,200,154,0.6)",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          untuk
        </div>
        <div
          style={{
            color: "#f5e6c4",
            fontSize: 20,
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            textAlign: "center",
            marginBottom: 4,
          }}
        >
          {d.displayName || d.username}
        </div>
        <div
          style={{
            color: "#6da562",
            fontSize: 12,
            fontWeight: 500,
            marginBottom: 24,
          }}
        >
          @{d.username}
        </div>
      </div>

      {/* ZONE 2 — Message */}
      <div
        style={{
          background: "rgba(255,255,255,0.055)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 14,
          padding: "20px 16px 14px",
          position: "relative",
          marginBottom: 20,
          zIndex: 1,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -20,
            left: 12,
            fontSize: 80,
            lineHeight: 1,
            color: "#c9a84c",
            fontFamily: "Georgia, 'Times New Roman', serif",
            opacity: 0.95,
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          "
        </div>
        <p
          style={{
            color: "#ddd4c0",
            fontSize: 14,
            lineHeight: 1.75,
            margin: "8px 0 0",
            textAlign: "left",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {d.content}
        </p>
      </div>

      {/* ZONE 3 — Branding */}
      <div
        style={{
          borderTop: "1px solid rgba(201,168,76,0.2)",
          paddingTop: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 1,
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {d.logoDataUrl ? (
            <img
              src={d.logoDataUrl}
              alt={d.appName}
              style={{ width: 16, height: 16, borderRadius: 3 }}
            />
          ) : null}
          <span style={{ color: "#c9a84c", fontSize: 13, fontWeight: 800 }}>
            {d.appName}
          </span>
        </div>
        <span
          style={{
            color: "#8aba7e",
            fontSize: 11,
            fontWeight: 600,
            background: "rgba(138,186,126,0.12)",
            border: "1px solid rgba(138,186,126,0.2)",
            borderRadius: 100,
            padding: "4px 11px",
          }}
        >
          Kirimi aku juga ↗
        </span>
      </div>
    </div>
  );
}

function CardWarmIvory({ d }: { d: CardData }) {
  return (
    <div
      style={{
        width: "100%",
        background: "#f7f0e6",
        borderRadius: 6,
        padding: "28px 24px 22px",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 6,
          pointerEvents: "none",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(180,140,100,0.12)",
        }}
      />
      {/* ZONE 1 — Recipient */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            background: "rgba(168,92,58,0.08)",
            border: "1px solid rgba(168,92,58,0.18)",
            borderRadius: 100,
            padding: "4px 12px",
            marginBottom: 22,
          }}
        >
          <Lock size={10} color="#a85c3a" />
          <span
            style={{
              color: "#a85c3a",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
            }}
          >
            PESAN ANONIM
          </span>
        </div>

        {/* Avatar */}
        <div
          style={{
            position: "relative",
            marginBottom: 14,
            width: 88,
            height: 88,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: -4,
              borderRadius: "50%",
              background: "#c4754f",
              opacity: 0.9,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: -1.5,
              borderRadius: "50%",
              background: "#f7f0e6",
            }}
          />
          {d.avatarDataUrl ? (
            <img
              src={d.avatarDataUrl}
              alt={d.displayName}
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
                display: "block",
                boxShadow: "0 4px 16px rgba(168,92,58,0.35)",
              }}
            />
          ) : (
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #c4754f 0%, #a85c3a 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 800,
                color: "#f7f0e6",
                boxShadow: "0 4px 16px rgba(168,92,58,0.35)",
              }}
            >
              {d.initials}
            </div>
          )}
        </div>

        <div
          style={{
            color: "#b89880",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          untuk
        </div>
        <div
          style={{
            color: "#1c0e06",
            fontSize: 20,
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            textAlign: "center",
            marginBottom: 4,
          }}
        >
          {d.displayName || d.username}
        </div>
        <div
          style={{
            color: "#a85c3a",
            fontSize: 12,
            fontWeight: 500,
            marginBottom: 24,
          }}
        >
          @{d.username}
        </div>
      </div>

      {/* ZONE 2 — Message */}
      <div
        style={{
          position: "relative",
          marginBottom: 22,
          paddingTop: 10,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -22,
            left: -6,
            fontSize: 88,
            lineHeight: 1,
            color: "#c4754f",
            fontFamily: "Georgia, 'Times New Roman', serif",
            opacity: 0.3,
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          "
        </div>
        <p
          style={{
            color: "#2a1508",
            fontSize: 14.5,
            lineHeight: 1.7,
            margin: 0,
            position: "relative",
            zIndex: 1,
            textAlign: "left",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {d.content}
        </p>
      </div>

      <div
        style={{
          height: 1,
          background:
            "linear-gradient(to right, transparent, #c4754f55, transparent)",
          marginBottom: 14,
        }}
      />

      {/* ZONE 3 — Branding */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {d.logoDataUrl ? (
            <img
              src={d.logoDataUrl}
              alt={d.appName}
              style={{ width: 16, height: 16, borderRadius: 3 }}
            />
          ) : null}
          <span style={{ color: "#a85c3a", fontSize: 13, fontWeight: 800 }}>
            {d.appName}
          </span>
        </div>
        <span
          style={{
            color: "#a85c3a",
            fontSize: 11,
            fontWeight: 600,
            background: "rgba(168,92,58,0.1)",
            border: "1px solid rgba(168,92,58,0.2)",
            borderRadius: 100,
            padding: "4px 11px",
          }}
        >
          Kirimi aku juga ↗
        </span>
      </div>
    </div>
  );
}

function CardDeepNavy({ d }: { d: CardData }) {
  return (
    <div
      style={{
        width: "100%",
        background: "#080e1c",
        borderRadius: 6,
        padding: "28px 24px 22px",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -60,
          left: "50%",
          transform: "translateX(-50%)",
          width: 300,
          height: 300,
          background:
            "radial-gradient(circle, rgba(64,220,200,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      {/* ZONE 1 — Recipient */}
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
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            background: "rgba(64,220,200,0.08)",
            border: "1px solid rgba(64,220,200,0.2)",
            borderRadius: 100,
            padding: "4px 12px",
            marginBottom: 22,
          }}
        >
          <Lock size={10} color="#40dcc8" />
          <span
            style={{
              color: "#40dcc8",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
            }}
          >
            PESAN ANONIM
          </span>
        </div>

        {/* Avatar */}
        <div
          style={{
            position: "relative",
            marginBottom: 14,
            width: 88,
            height: 88,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: -6,
              borderRadius: "50%",
              background: "rgba(64,220,200,0.2)",
              filter: "blur(8px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: -4,
              borderRadius: "50%",
              background:
                "conic-gradient(#40dcc8 0%, #00bfaa 30%, #40dcc8 60%, #7aeee2 90%, #40dcc8 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: -1,
              borderRadius: "50%",
              background: "#080e1c",
            }}
          />
          {d.avatarDataUrl ? (
            <img
              src={d.avatarDataUrl}
              alt={d.displayName}
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #0d2030 0%, #0a1828 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 800,
                color: "#40dcc8",
                border: "1px solid rgba(64,220,200,0.15)",
              }}
            >
              {d.initials}
            </div>
          )}
        </div>

        <div
          style={{
            color: "rgba(64,220,200,0.5)",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          untuk
        </div>
        <div
          style={{
            color: "#e8f4f8",
            fontSize: 20,
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            textAlign: "center",
            marginBottom: 4,
          }}
        >
          {d.displayName || d.username}
        </div>
        <div
          style={{
            color: "#5a9db5",
            fontSize: 12,
            fontWeight: 500,
            marginBottom: 24,
          }}
        >
          @{d.username}
        </div>
      </div>

      {/* ZONE 2 — Message */}
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 14,
          padding: "20px 16px 14px",
          position: "relative",
          marginBottom: 20,
          zIndex: 1,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -22,
            left: 12,
            fontSize: 80,
            lineHeight: 1,
            color: "#40dcc8",
            fontFamily: "Georgia, 'Times New Roman', serif",
            opacity: 0.7,
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          "
        </div>
        <p
          style={{
            color: "#b8d8e8",
            fontSize: 14,
            lineHeight: 1.75,
            margin: "8px 0 0",
            textAlign: "left",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {d.content}
        </p>
      </div>

      {/* ZONE 3 — Branding */}
      <div
        style={{
          borderTop: "1px solid rgba(64,220,200,0.15)",
          paddingTop: 14,
          zIndex: 1,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {d.logoDataUrl ? (
            <img
              src={d.logoDataUrl}
              alt={d.appName}
              style={{ width: 16, height: 16, borderRadius: 3 }}
            />
          ) : null}
          <span style={{ color: "#40dcc8", fontSize: 13, fontWeight: 800 }}>
            {d.appName}
          </span>
        </div>
        <span
          style={{
            color: "#40dcc8",
            fontSize: 11,
            fontWeight: 600,
            background: "rgba(64,220,200,0.1)",
            border: "1px solid rgba(64,220,200,0.2)",
            borderRadius: 100,
            padding: "4px 11px",
          }}
        >
          Kirimi aku juga ↗
        </span>
      </div>
    </div>
  );
}

function CardCleanUI({ d }: { d: CardData }) {
  return (
    <div
      style={{
        width: "100%",
        background: "#ffffff",
        borderRadius: 6,
        overflow: "hidden",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #0e9f8e 0%, #0b8a7a 100%)",
          padding: "20px 20px 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          {d.avatarDataUrl ? (
            <img
              src={d.avatarDataUrl}
              alt={d.displayName}
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2.5px solid rgba(255,255,255,0.8)",
                flexShrink: 0,
              }}
            />
          ) : (
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.25)",
                border: "2.5px solid rgba(255,255,255,0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: 800,
                color: "white",
                flexShrink: 0,
              }}
            >
              {d.initials}
            </div>
          )}
          <div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "white",
                lineHeight: 1.2,
              }}
            >
              {d.displayName || d.username}
            </div>
            <div
              style={{
                fontSize: 11.5,
                color: "rgba(255,255,255,0.75)",
                marginTop: 2,
              }}
            >
              @{d.username}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "16px 16px 18px" }}>
        {/* Message card */}
        <div
          style={{
            background: "#f8fafb",
            border: "1px solid #eef1f4",
            borderRadius: 12,
            padding: "14px 14px 16px",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: "#eef1f4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Lock size={12} color="#9aabb8" />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#444" }}>
                Anonim
              </span>
            </div>
            <span style={{ fontSize: 11, color: "#aab5be" }}>{d.timeAgo}</span>
          </div>

          <p
            style={{
              fontSize: 17,
              color: "#1a2730",
              lineHeight: 1.65,
              margin: 0,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {d.content}
          </p>
        </div>

        {/* Branding footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            paddingTop: 4,
          }}
        >
          {d.logoDataUrl ? (
            <img
              src={d.logoDataUrl}
              alt={d.appName}
              style={{ width: 14, height: 14, borderRadius: 3 }}
            />
          ) : null}
          <span style={{ fontSize: 11, color: "#aab5be" }}>dibagikan via</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: "#0e9f8e" }}>
            {d.appName}
          </span>
          <span style={{ fontSize: 11, color: "#aab5be" }}>·</span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#0e9f8e",
              background: "#eef9f7",
              borderRadius: 100,
              padding: "2px 8px",
            }}
          >
            Kirimi aku juga ↗
          </span>
        </div>
      </div>
    </div>
  );
}

const TEMPLATES = [
  {
    id: "sage-garden",
    label: "Hutan",
    dot: "#8aba7e",
    bg: "#163824",
  },
  {
    id: "warm-ivory",
    label: "Krem",
    dot: "#c4754f",
    bg: "#f7f0e6",
  },
  {
    id: "deep-navy",
    label: "Malam",
    dot: "#40dcc8",
    bg: "#080e1c",
  },
  {
    id: "clean-ui",
    label: "Bersih",
    dot: "#0e9f8e",
    bg: "#ffffff",
  },
] as const;

type TemplateId = (typeof TEMPLATES)[number]["id"];

type ShareMessageCardProps = {
  content: string;
  createdAt: string;
  paletteIdx: number;
  displayName: string;
  username: string;
  avatarUrl?: string | null;
  onClose: () => void;
};

export function ShareMessageCard({
  content,
  createdAt,
  displayName,
  username,
  avatarUrl,
  onClose,
}: ShareMessageCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateId>("sage-garden");
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
        {/* Header */}
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

        {/* Template selector pills */}
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
                  gap: 6,
                  padding: "7px 0",
                  borderRadius: 100,
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
                    width: 8,
                    height: 8,
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

        {/* Card preview — this gets captured */}
        <div
          ref={cardRef}
          style={{
            borderRadius: 6,
            overflow: "hidden",
            width: "100%",
          }}
        >
          {selectedTemplate === "sage-garden" && (
            <CardSageGarden d={cardData} />
          )}
          {selectedTemplate === "warm-ivory" && <CardWarmIvory d={cardData} />}
          {selectedTemplate === "deep-navy" && <CardDeepNavy d={cardData} />}
          {selectedTemplate === "clean-ui" && <CardCleanUI d={cardData} />}
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
