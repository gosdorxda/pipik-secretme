import { Lock } from "lucide-react";

export function WarmIvory() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#b8b0a4" }}
    >
      <div
        style={{
          width: 340,
          background: "#f7f0e6",
          borderRadius: 22,
          padding: "28px 24px 22px",
          boxShadow:
            "0 24px 56px rgba(0,0,0,0.22), 0 0 0 1px rgba(180,140,100,0.15)",
          display: "flex",
          flexDirection: "column",
          fontFamily: "'Inter', system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle warm inner shadow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 22,
            pointerEvents: "none",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(180,140,100,0.12)",
          }}
        />

        {/* ZONE 1 — RECIPIENT */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Badge */}
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

          {/* Avatar with terracotta ring */}
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
                letterSpacing: "0.02em",
                boxShadow: "0 4px 16px rgba(168,92,58,0.35)",
              }}
            >
              AR
            </div>
          </div>

          {/* "untuk" label */}
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
          {/* Recipient Name */}
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
            Anisa Rahmawati
          </div>
          {/* Handle */}
          <div
            style={{
              color: "#a85c3a",
              fontSize: 12,
              fontWeight: 500,
              marginBottom: 24,
            }}
          >
            @anisa_r
          </div>
        </div>

        {/* ZONE 2 — MESSAGE */}
        <div style={{ position: "relative", marginBottom: 22, paddingTop: 10 }}>
          {/* Big decorative open-quote */}
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
            }}
          >
            Kamu itu orangnya selalu bisa bikin semua orang di sekitar kamu
            ngerasa nyaman dan diterima. Beneran deh, itu salah satu hal paling
            keren yang bisa dimiliki seseorang 🌿
          </p>
        </div>

        {/* Thin divider */}
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(to right, transparent, #c4754f55, transparent)",
            marginBottom: 14,
          }}
        />

        {/* ZONE 3 — BRANDING */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              color: "#a85c3a",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: "0.01em",
            }}
          >
            kepoin.me
          </span>
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
    </div>
  );
}
