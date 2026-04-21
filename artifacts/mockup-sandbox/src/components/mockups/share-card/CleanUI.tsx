import { Lock } from "lucide-react";

export function CleanUI() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#e8edf2" }}
    >
      <div
        style={{
          width: 340,
          background: "#ffffff",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)",
          fontFamily: "'Inter', system-ui, sans-serif",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* TOP HEADER — teal app bar */}
        <div
          style={{
            background: "linear-gradient(135deg, #0e9f8e 0%, #0b8a7a 100%)",
            padding: "20px 20px 28px",
            position: "relative",
          }}
        >
          {/* Recipient profile */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 6,
            }}
          >
            {/* Avatar */}
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
              AR
            </div>
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "white",
                  lineHeight: 1.2,
                }}
              >
                Anisa Rahmawati
              </div>
              <div
                style={{
                  fontSize: 11.5,
                  color: "rgba(255,255,255,0.75)",
                  marginTop: 2,
                }}
              >
                @anisa_r · 23 pesan diterima
              </div>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div style={{ padding: "16px 16px 18px" }}>
          {/* Message card */}
          <div
            style={{
              background: "#f8fafb",
              border: "1px solid #eef1f4",
              borderRadius: 16,
              padding: "14px 14px 16px",
              marginBottom: 16,
            }}
          >
            {/* Sender row */}
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
              <span style={{ fontSize: 11, color: "#aab5be" }}>2 jam lalu</span>
            </div>

            {/* Message text */}
            <p
              style={{
                fontSize: 17,
                color: "#1a2730",
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              Kamu itu orangnya selalu bisa bikin semua orang di sekitar kamu
              ngerasa nyaman dan diterima. Beneran deh, itu salah satu hal
              paling keren yang bisa dimiliki seseorang 🌿
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
            <span style={{ fontSize: 11, color: "#aab5be" }}>
              dibagikan via
            </span>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#0e9f8e" }}>
              kepoin.me
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
    </div>
  );
}
