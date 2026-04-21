import { Lock, ArrowUpFromLine, CornerDownLeft } from "lucide-react";

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
          boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)",
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
          {/* "Pesan baru!" floating bubble */}
          <div
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              background: "white",
              borderRadius: 12,
              padding: "6px 10px",
              boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
              display: "flex",
              alignItems: "center",
              gap: 6,
              maxWidth: 145,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#0e9f8e",
                flexShrink: 0,
              }}
            />
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#111", lineHeight: 1.2 }}>
                Pesan baru!
              </div>
              <div style={{ fontSize: 9, color: "#888", lineHeight: 1.2 }}>
                dari seseorang anonim
              </div>
            </div>
          </div>

          {/* Recipient profile */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
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
              <div style={{ fontSize: 15, fontWeight: 700, color: "white", lineHeight: 1.2 }}>
                Anisa Rahmawati
              </div>
              <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>
                @anisa_r · 23 pesan diterima
              </div>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div style={{ padding: "0 16px 18px" }}>
          {/* INBOX label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 0 10px",
              borderBottom: "1px solid #f0f0f0",
              marginBottom: 12,
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, color: "#555", letterSpacing: "0.08em" }}>
              PESAN ANONIM UNTUKMU
            </span>
            <div
              style={{
                background: "#0e9f8e",
                color: "white",
                fontSize: 10,
                fontWeight: 700,
                borderRadius: 100,
                padding: "2px 7px",
                minWidth: 18,
                textAlign: "center",
              }}
            >
              1
            </div>
          </div>

          {/* Message card */}
          <div
            style={{
              background: "#f8fafb",
              border: "1px solid #eef1f4",
              borderRadius: 16,
              padding: "14px 14px 12px",
              marginBottom: 10,
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
                <span style={{ fontSize: 12, fontWeight: 600, color: "#444" }}>Anonim</span>
              </div>
              <span style={{ fontSize: 11, color: "#aab5be" }}>2 jam lalu</span>
            </div>

            {/* Message text */}
            <p
              style={{
                fontSize: 14.5,
                color: "#1a2730",
                lineHeight: 1.65,
                margin: "0 0 13px",
              }}
            >
              Kamu itu orangnya selalu bisa bikin semua orang di sekitar kamu ngerasa nyaman dan diterima. Beneran deh, itu salah satu hal paling keren yang bisa dimiliki seseorang 🌿
            </p>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 8 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  background: "#eef9f7",
                  border: "1px solid #c5eae5",
                  borderRadius: 100,
                  padding: "6px 13px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#0e9f8e",
                  cursor: "default",
                }}
              >
                <CornerDownLeft size={12} />
                Balas
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  background: "#f4f5f7",
                  border: "1px solid #e4e7eb",
                  borderRadius: 100,
                  padding: "6px 13px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#556070",
                  cursor: "default",
                }}
              >
                <ArrowUpFromLine size={12} />
                Bagikan
              </div>
            </div>
          </div>

          {/* Bottom teaser row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#f4f7fa",
              borderRadius: 12,
              padding: "10px 14px",
              marginBottom: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {/* Blurred mystery avatars */}
              {["?", "?", "?"].map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: `hsl(${180 + i * 25},50%,65%)`,
                    border: "1.5px solid white",
                    marginLeft: i > 0 ? -6 : 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    color: "white",
                    fontWeight: 700,
                  }}
                >
                  ?
                </div>
              ))}
              <span style={{ fontSize: 11.5, color: "#556070", marginLeft: 4 }}>
                +2 pesan baru menunggumu
              </span>
            </div>
            <span
              style={{ fontSize: 11.5, fontWeight: 700, color: "#0e9f8e", whiteSpace: "nowrap" }}
            >
              Lihat →
            </span>
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
            <span style={{ fontSize: 11, color: "#aab5be" }}>dibagikan via</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#0e9f8e" }}>kepoin.me</span>
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
