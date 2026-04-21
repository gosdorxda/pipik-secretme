import { Lock } from "lucide-react";

export function SageGarden() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#c8d4c5" }}>
      <div
        style={{
          width: 340,
          background: "linear-gradient(160deg, #0b2218 0%, #163824 55%, #0d2e1c 100%)",
          borderRadius: 24,
          padding: "28px 24px 22px",
          boxShadow: "0 28px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.15)",
          display: "flex",
          flexDirection: "column",
          fontFamily: "'Inter', system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Radial glow top */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: 24, pointerEvents: "none",
          background: "radial-gradient(ellipse at 50% 0%, rgba(160,210,130,0.09) 0%, transparent 60%)",
        }} />

        {/* ZONE 1 — RECIPIENT */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 100, padding: "4px 12px", marginBottom: 22,
          }}>
            <Lock size={10} color="#8aba7e" />
            <span style={{ color: "#8aba7e", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em" }}>
              PESAN ANONIM
            </span>
          </div>

          {/* Avatar with gold ring */}
          <div style={{ position: "relative", marginBottom: 14, width: 88, height: 88 }}>
            <div style={{
              position: "absolute", inset: -4, borderRadius: "50%",
              background: "conic-gradient(#c9a84c 0%, #f0d878 40%, #c9a84c 70%, #a8862e 100%)",
            }} />
            <div style={{ position: "absolute", inset: -1, borderRadius: "50%", background: "#0d2e1c" }} />
            <div style={{
              position: "relative", width: "100%", height: "100%", borderRadius: "50%",
              background: "linear-gradient(135deg, #2a5438 0%, #1c3d28 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, fontWeight: 800, color: "#c9a84c", letterSpacing: "0.02em",
            }}>
              AR
            </div>
          </div>

          {/* "untuk" label */}
          <div style={{ color: "rgba(165,200,154,0.6)", fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>
            untuk
          </div>
          {/* Recipient Name */}
          <div style={{ color: "#f5e6c4", fontSize: 20, fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em", textAlign: "center", marginBottom: 4 }}>
            Anisa Rahmawati
          </div>
          {/* Handle */}
          <div style={{ color: "#6da562", fontSize: 12, fontWeight: 500, marginBottom: 24 }}>
            @anisa_r
          </div>
        </div>

        {/* ZONE 2 — MESSAGE */}
        <div style={{
          background: "rgba(255,255,255,0.055)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 14, padding: "20px 16px 14px",
          position: "relative", marginBottom: 20,
        }}>
          <div style={{
            position: "absolute", top: -20, left: 12,
            fontSize: 80, lineHeight: 1, color: "#c9a84c",
            fontFamily: "Georgia, 'Times New Roman', serif", opacity: 0.95,
            userSelect: "none", pointerEvents: "none",
          }}>"</div>
          <p style={{ color: "#ddd4c0", fontSize: 13.5, lineHeight: 1.75, margin: "8px 0 0", textAlign: "left" }}>
            Kamu itu orangnya selalu bisa bikin semua orang di sekitar kamu ngerasa nyaman dan diterima. Beneran deh, itu salah satu hal paling keren yang bisa dimiliki seseorang 🌿
          </p>
        </div>

        {/* ZONE 3 — BRANDING */}
        <div style={{
          borderTop: "1px solid rgba(201,168,76,0.2)",
          paddingTop: 14,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ color: "#c9a84c", fontSize: 13, fontWeight: 800, letterSpacing: "0.01em" }}>
            kepoin.me
          </span>
          <span style={{
            color: "#8aba7e", fontSize: 11, fontWeight: 600,
            background: "rgba(138,186,126,0.12)", border: "1px solid rgba(138,186,126,0.2)",
            borderRadius: 100, padding: "4px 11px",
          }}>
            Kirimi aku juga ↗
          </span>
        </div>
      </div>
    </div>
  );
}
