import { Lock } from "lucide-react";

export function DeepNavy() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#0a0f1a" }}
    >
      <div
        style={{
          width: 340,
          background: "#080e1c",
          borderRadius: 24,
          padding: "28px 24px 22px",
          boxShadow:
            "0 28px 72px rgba(0,0,0,0.7), 0 0 0 1px rgba(64,255,218,0.1)",
          display: "flex",
          flexDirection: "column",
          fontFamily: "'Inter', system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Radial teal glow from top center */}
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

        {/* ZONE 1 — RECIPIENT */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Badge */}
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

          {/* Avatar with glowing teal ring */}
          <div
            style={{
              position: "relative",
              marginBottom: 14,
              width: 88,
              height: 88,
            }}
          >
            {/* Outer glow */}
            <div
              style={{
                position: "absolute",
                inset: -6,
                borderRadius: "50%",
                background: "rgba(64,220,200,0.2)",
                filter: "blur(8px)",
              }}
            />
            {/* Teal ring */}
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
                letterSpacing: "0.02em",
                border: "1px solid rgba(64,220,200,0.15)",
              }}
            >
              AR
            </div>
          </div>

          {/* "untuk" label */}
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
          {/* Recipient Name */}
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
            Anisa Rahmawati
          </div>
          {/* Handle */}
          <div
            style={{
              color: "#5a9db5",
              fontSize: 12,
              fontWeight: 500,
              marginBottom: 24,
            }}
          >
            @anisa_r
          </div>
        </div>

        {/* ZONE 2 — MESSAGE (glassmorphism inset) */}
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
          {/* Big decorative quote */}
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
              fontSize: 13.5,
              lineHeight: 1.75,
              margin: "8px 0 0",
              textAlign: "left",
            }}
          >
            Kamu itu orangnya selalu bisa bikin semua orang di sekitar kamu
            ngerasa nyaman dan diterima. Beneran deh, itu salah satu hal paling
            keren yang bisa dimiliki seseorang 🌿
          </p>
        </div>

        {/* ZONE 3 — BRANDING */}
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
          <span
            style={{
              color: "#40dcc8",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: "0.01em",
            }}
          >
            kepoin.me
          </span>
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
    </div>
  );
}
