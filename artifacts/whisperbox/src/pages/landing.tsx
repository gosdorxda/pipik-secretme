import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Crown } from "lucide-react";
import { useAuth } from "@clerk/react";
import { Footer } from "@/components/footer";

const ACTIVITIES = [
  {
    avatar: "A",
    name: "Agus",
    color: "#3b82f6",
    text: "baru saja menerima 3 pesan baru",
    tag: "🔔",
    time: "2 mnt lalu",
  },
  {
    avatar: "R",
    name: "Rina",
    color: "#f43f5e",
    text: 'mendapat pesan: "Kamu itu orangnya asik banget!"',
    tag: "💬",
    time: "5 mnt lalu",
  },
  {
    avatar: "B",
    name: "Budi",
    color: "#8b5cf6",
    text: "baru bergabung dan langsung menerima 2 pesan",
    tag: "⚡",
    time: "11 mnt lalu",
  },
  {
    avatar: "S",
    name: "Siti",
    color: "#f59e0b",
    text: "upgrade ke Premium — social links aktif",
    tag: "✨",
    time: "18 mnt lalu",
  },
  {
    avatar: "D",
    name: "Dedi",
    color: "#10b981",
    text: "berbagi link ke 200+ followers-nya",
    tag: "🔗",
    time: "24 mnt lalu",
  },
  {
    avatar: "N",
    name: "Nina",
    color: "#ec4899",
    text: "mendapat pertanyaan jujur dari temannya",
    tag: "💭",
    time: "31 mnt lalu",
  },
  {
    avatar: "F",
    name: "Fajar",
    color: "#f97316",
    text: "membalas 5 pesan anonim hari ini",
    tag: "↩️",
    time: "42 mnt lalu",
  },
  {
    avatar: "M",
    name: "Maya",
    color: "#14b8a6",
    text: "aktivasi notifikasi email untuk pesan baru",
    tag: "📧",
    time: "1 jam lalu",
  },
];

const TICKER_ITEMS = [...ACTIVITIES, ...ACTIVITIES];
const ITEM_HEIGHT = 80;
const ITEM_GAP = 10;
const ITEM_STEP = ITEM_HEIGHT + ITEM_GAP;
const TICKER_VISIBLE = 4;
const CONTAINER_HEIGHT = TICKER_VISIBLE * ITEM_STEP - ITEM_GAP;

function ActivityTicker() {
  return (
    <div
      className="rounded-2xl overflow-hidden relative"
      style={{
        height: CONTAINER_HEIGHT,
        border: "1px solid rgba(134,234,212,0.2)",
        background: "rgba(255,255,255,0.03)",
        maskImage:
          "linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent)",
      }}
    >
      <div
        className="activity-ticker"
        style={{ display: "flex", flexDirection: "column", gap: ITEM_GAP }}
      >
        {TICKER_ITEMS.map((item, i) => (
          <div
            key={i}
            style={{
              height: ITEM_HEIGHT,
              minHeight: ITEM_HEIGHT,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            className="flex items-center gap-3 px-3 rounded-xl shrink-0"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ backgroundColor: item.color }}
            >
              {item.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/90 truncate">
                <span className="font-semibold">{item.name}</span>{" "}
                <span className="text-white/50">{item.text}</span>
              </p>
              <p className="text-xs text-white/30 mt-0.5">{item.time}</p>
            </div>
            <span className="text-base shrink-0 leading-none">{item.tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroMockup() {
  const msgStripe = "linear-gradient(to right, #86ead4, #60c4ae)";
  const msgBg = "rgba(134,234,212,0.10)";
  const msgBorder = "rgba(134,234,212,0.30)";

  return (
    <div className="relative flex justify-center items-center">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #86ead4, transparent 70%)",
          }}
        />
      </div>

      <div
        className="hero-card-float relative w-full max-w-[360px] overflow-hidden rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow:
            "0 24px 80px rgba(0,0,0,0.4), 0 4px 16px rgba(134,234,212,0.15)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          className="px-5 pt-4 pb-3 flex items-center gap-3"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
            B
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white leading-none">
              Budi Santoso
            </p>
            <p className="text-xs text-white/50 mt-0.5">
              @budi_s · 47 pesan diterima
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            Live
          </div>
        </div>

        <div className="px-5 pt-3 pb-2 flex items-center gap-2">
          <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
            Inbox
          </span>
          <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none">
            3
          </span>
        </div>

        <div
          className="mx-4 mb-4 msg-bubble-1 overflow-hidden rounded-xl"
          style={{ border: `1px solid ${msgBorder}`, background: msgBg }}
        >
          <div style={{ height: 3, background: msgStripe }} />
          <div className="px-4 pt-3 pb-2 flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "#ede9fe", border: "1px solid #c4b5fd" }}
            >
              <svg
                className="w-3 h-3"
                style={{ color: "#6d28d9" }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-violet-300">
              Anonim
            </span>
            <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
            <span className="text-[10px] text-white/30 ml-auto">
              2 jam lalu
            </span>
          </div>
          <div className="px-4 pb-3">
            <p className="text-sm leading-relaxed text-white/85">
              Kamu itu orangnya sangat menyenangkan, selalu bisa bikin orang
              senyum 😊
            </p>
          </div>
          <div
            className="px-4 pb-3 pt-1 flex items-center gap-2"
            style={{ borderTop: `1px solid ${msgBorder}` }}
          >
            <button
              className="flex items-center gap-1.5 text-[11px] font-semibold text-primary px-2.5 py-1.5 rounded-md transition-colors"
              style={{
                background: "rgba(134,234,212,0.15)",
                border: "1px solid rgba(134,234,212,0.3)",
              }}
            >
              ↩ Balas
            </button>
            <button
              className="flex items-center gap-1.5 text-[11px] text-white/40 px-2.5 py-1.5 rounded-md"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            >
              ↑ Bagikan
            </button>
          </div>
        </div>

        <div
          className="msg-bubble-2 mx-4 mb-4 px-4 py-2.5 rounded-xl flex items-center gap-3"
          style={{
            border: "1px dashed rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.03)",
          }}
        >
          <div className="flex -space-x-1.5">
            {["#8b5cf6", "#3b82f6", "#f43f5e"].map((c, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                style={{ background: c, borderColor: "#0f2e28", zIndex: 3 - i }}
              >
                <span className="text-white text-[8px] font-bold">?</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/40 flex-1">
            +2 pesan baru lainnya menunggumu
          </p>
          <span className="text-[10px] font-semibold text-primary">
            Lihat →
          </span>
        </div>
      </div>

      <div
        className="absolute -top-3 -right-3 md:-right-6 rounded-xl px-3 py-2 flex items-center gap-2 msg-bubble-1"
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        <div className="w-5 h-5 bg-primary rounded-md flex items-center justify-center text-[10px] shrink-0">
          💬
        </div>
        <div>
          <p className="text-[10px] font-semibold text-white leading-none">
            Pesan baru!
          </p>
          <p className="text-[9px] text-white/40 mt-0.5">
            dari seseorang anonim
          </p>
        </div>
      </div>
    </div>
  );
}

const STATS = [
  { value: "12.400+", label: "Pengguna aktif", color: "#86ead4" },
  { value: "94.000+", label: "Pesan terkirim", color: "#a78bfa" },
  { value: "100%", label: "Anonim & aman", color: "#38bdf8" },
  { value: "Gratis", label: "Untuk memulai", color: "#fb7185" },
];

const FEATURES = [
  {
    icon: "🔒",
    title: "100% Anonim",
    desc: "Pengirim tidak pernah teridentifikasi. Tanpa tracking, tanpa IP logging — selamanya.",
    bg: "#ede9fe",
    border: "#c4b5fd",
    iconBg: "#ddd6fe",
    accent: "#6d28d9",
  },
  {
    icon: "⚡",
    title: "Terima Instan",
    desc: "Pesan muncul di inbox-mu begitu dikirim. Real-time, tanpa delay, langsung notif.",
    bg: "#ddf9f2",
    border: "#86ead4",
    iconBg: "#86ead4",
    accent: "#1a443c",
    featured: true,
  },
  {
    icon: "🔗",
    title: "Link Personalmu",
    desc: "Satu link untuk dibagikan ke mana saja — siapa pun bisa kirim pesan tanpa akun.",
    bg: "#e0f2fe",
    border: "#7dd3fc",
    iconBg: "#bae6fd",
    accent: "#0369a1",
  },
];

const HOW_STEPS = [
  {
    step: "01",
    title: "Buat akun gratis",
    desc: "Daftar dalam 30 detik. Langsung dapat link personalmu sendiri.",
    emoji: "✨",
    color: "#86ead4",
  },
  {
    step: "02",
    title: "Bagikan link-mu",
    desc: "Share ke bio Instagram, Twitter, atau ke teman-temanmu langsung.",
    emoji: "🔗",
    color: "#a78bfa",
  },
  {
    step: "03",
    title: "Terima pesan anonim",
    desc: "Semua pesan masuk ke dashboard-mu. Identitas pengirim selalu tersembunyi.",
    emoji: "💬",
    color: "#38bdf8",
  },
];

export default function LandingPage() {
  const { isSignedIn } = useAuth();

  return (
    <div className="min-h-[100dvh] flex flex-col text-foreground">
      {/* ── NAVBAR ── */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: "rgba(7,24,17,0.85)",
          borderColor: "rgba(134,234,212,0.12)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.svg"
              alt="vooi"
              className="w-7 h-7"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <span className="font-bold text-white tracking-tight">
              vooi<span style={{ color: "#86ead4" }}>.lol</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isSignedIn ? (
              <Link href="/dashboard">
                <Button size="sm">Buka Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    Masuk
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm" className="font-semibold">
                    Mulai Gratis
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ── HERO ── dark green gradient */}
        <section
          className="relative overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, #061410 0%, #0a2018 40%, #0f2e28 70%, #071810 100%)",
          }}
        >
          {/* Animated gradient orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute w-[600px] h-[600px] rounded-full landing-orb-1"
              style={{
                top: "-20%",
                left: "-10%",
                background:
                  "radial-gradient(circle, rgba(134,234,212,0.12) 0%, transparent 65%)",
              }}
            />
            <div
              className="absolute w-[500px] h-[500px] rounded-full landing-orb-2"
              style={{
                bottom: "-10%",
                right: "-5%",
                background:
                  "radial-gradient(circle, rgba(167,139,250,0.10) 0%, transparent 65%)",
              }}
            />
            <div
              className="absolute w-[400px] h-[400px] rounded-full landing-orb-3"
              style={{
                top: "30%",
                right: "20%",
                background:
                  "radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 65%)",
              }}
            />
            {/* Dot grid */}
            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #86ead4 1.5px, transparent 1.5px)",
                backgroundSize: "28px 28px",
              }}
            />
          </div>

          <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-28 grid md:grid-cols-2 gap-12 md:gap-8 items-center">
            {/* Left: text */}
            <div className="flex flex-col items-start">
              <div
                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-6"
                style={{
                  background: "rgba(134,234,212,0.12)",
                  border: "1px solid rgba(134,234,212,0.25)",
                  color: "#86ead4",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                12.400+ pengguna aktif di Indonesia
              </div>

              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-5 leading-[1.05] text-white">
                Pesan jujur,
                <br />
                <span
                  style={{
                    background:
                      "linear-gradient(90deg, #86ead4 0%, #60c4ae 50%, #a78bfa 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  tanpa batas.
                </span>
              </h1>

              <p className="text-base text-white/55 mb-8 max-w-md leading-relaxed">
                Bagikan link personalmu. Siapa saja bisa kirim pesan anonim —
                tanpa akun, tanpa identitas. Semua masuk ke dashboard-mu
                real-time.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    className="px-8 text-base font-semibold gap-2"
                  >
                    Buat Link-mu <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="px-8 text-base text-white/70 hover:text-white hover:bg-white/10 border border-white/15"
                  >
                    Sudah punya akun
                  </Button>
                </Link>
              </div>

              <p className="mt-5 text-xs text-white/30">
                Tidak perlu kartu kredit &nbsp;·&nbsp; Gratis selamanya
                &nbsp;·&nbsp; Setup 30 detik
              </p>
            </div>

            {/* Right: mockup */}
            <div className="relative pt-6 pb-6 flex justify-center">
              <HeroMockup />
            </div>
          </div>

          {/* Bottom fade into next section */}
          <div
            className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, transparent, #f8fafc)",
            }}
          />
        </section>

        {/* ── FEATURES ── light bg */}
        <section className="bg-[#f8fafc] pt-20 pb-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                Kenapa vooi.lol?
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Dirancang untuk kejujuran
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="relative p-7 rounded-2xl overflow-hidden group transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: f.bg,
                    border: `1px solid ${f.border}`,
                    boxShadow: f.featured
                      ? "0 8px 32px rgba(134,234,212,0.25)"
                      : "0 2px 12px rgba(0,0,0,0.04)",
                  }}
                >
                  {f.featured && (
                    <div
                      className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: "#1a443c",
                        color: "#86ead4",
                      }}
                    >
                      ★ Favorit
                    </div>
                  )}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-xl"
                    style={{ background: f.iconBg }}
                  >
                    {f.icon}
                  </div>
                  <h3
                    className="text-base font-bold mb-2"
                    style={{ color: f.accent }}
                  >
                    {f.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: f.accent, opacity: 0.7 }}
                  >
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── white */}
        <section className="bg-white py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-14">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                Cara Kerja
              </p>
              <h2 className="text-3xl md:text-4xl font-bold">
                Mulai dalam 3 langkah mudah
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-10 left-[calc(33.33%+1rem)] right-[calc(33.33%+1rem)] h-px border-t-2 border-dashed border-border" />
              {HOW_STEPS.map(({ step, title, desc, emoji, color }) => (
                <div
                  key={step}
                  className="flex flex-col items-center text-center gap-4"
                >
                  <div
                    className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center z-10 shadow-sm"
                    style={{
                      background: color + "20",
                      border: `2px solid ${color}`,
                    }}
                  >
                    <span className="text-2xl">{emoji}</span>
                    <span
                      className="text-[10px] font-bold tracking-widest mt-0.5"
                      style={{ color }}
                    >
                      {step}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-1.5">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATS ── dark section */}
        <section
          className="relative overflow-hidden py-20"
          style={{
            background:
              "linear-gradient(135deg, #071810 0%, #0f2e28 50%, #0a1a2e 100%)",
          }}
        >
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #86ead4 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
          </div>
          <div className="relative max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {STATS.map(({ value, label, color }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <p
                    className="text-4xl md:text-5xl font-bold"
                    style={{
                      color,
                      textShadow: `0 0 40px ${color}60`,
                    }}
                  >
                    {value}
                  </p>
                  <p className="text-xs text-white/40 font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ACTIVITY ── dark */}
        <section
          className="relative overflow-hidden py-24"
          style={{
            background:
              "linear-gradient(160deg, #0a1a2e 0%, #0f2e28 60%, #071810 100%)",
          }}
        >
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute w-[500px] h-[500px] rounded-full"
              style={{
                top: "-15%",
                right: "-10%",
                background:
                  "radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 65%)",
              }}
            />
          </div>
          <div className="relative max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-14 items-center">
              <div>
                <div
                  className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-5"
                  style={{
                    background: "rgba(56,189,248,0.12)",
                    border: "1px solid rgba(56,189,248,0.25)",
                    color: "#38bdf8",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
                  Aktivitas Live
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                  Ribuan orang sudah
                  <br />
                  <span
                    style={{
                      background: "linear-gradient(90deg, #86ead4, #a78bfa)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    aktif hari ini
                  </span>
                </h2>
                <p className="text-white/45 text-sm leading-relaxed mb-7">
                  Bergabunglah dengan komunitas yang terus berkembang. Terima
                  masukan jujur, ungkapan rasa, dan pertanyaan yang tidak pernah
                  berani diucapkan langsung.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/sign-up">
                    <Button className="gap-2 font-semibold">
                      Mulai Gratis <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/sign-in">
                    <Button
                      variant="ghost"
                      className="gap-2 text-white/60 hover:text-white hover:bg-white/10 border border-white/15"
                    >
                      Masuk ke akun
                    </Button>
                  </Link>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                    Aktivitas Terbaru
                  </p>
                  <span className="flex items-center gap-1.5 text-xs text-white/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
                    Live
                  </span>
                </div>
                <ActivityTicker />
                <p className="text-xs text-white/20 text-center mt-3">
                  Data ilustrasi — bukan data pengguna nyata
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── gradient */}
        <section
          className="relative overflow-hidden py-20"
          style={{
            background:
              "linear-gradient(135deg, #2d1b69 0%, #0f2e28 50%, #1e1b4b 100%)",
          }}
        >
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute -top-24 -right-24 w-80 h-80 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(134,234,212,0.15) 0%, transparent 65%)",
              }}
            />
            <div
              className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 65%)",
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
          </div>

          <div className="relative max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-5"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "white",
                  }}
                >
                  <Crown className="w-3 h-3" /> Tersedia juga versi Premium
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-[1.15]">
                  Siap menerima
                  <br />
                  <span
                    style={{
                      background: "linear-gradient(90deg, #86ead4, #a78bfa)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    kejujuran?
                  </span>
                </h2>
                <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-xs">
                  Buat link personalmu sekarang — gratis selamanya. Upgrade
                  kapan saja.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/sign-up">
                    <Button size="lg" className="font-semibold px-8 gap-2">
                      Buat Akun Gratis <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/upgrade">
                    <Button
                      size="lg"
                      variant="ghost"
                      className="px-8 text-white/70 hover:text-white hover:bg-white/10 border border-white/20"
                    >
                      Lihat Premium
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {[
                  {
                    icon: "🔒",
                    title: "100% Anonim",
                    desc: "Identitas pengirim tidak pernah tersimpan atau terungkap.",
                    accent: "#86ead4",
                  },
                  {
                    icon: "⚡",
                    title: "Terima Pesan Instan",
                    desc: "Pesan langsung muncul di inbox-mu begitu dikirim.",
                    accent: "#a78bfa",
                  },
                  {
                    icon: "🔗",
                    title: "Link Personal-mu",
                    desc: "Satu link untuk dibagikan ke mana saja.",
                    accent: "#38bdf8",
                  },
                ].map(({ icon, title, desc, accent }) => (
                  <div
                    key={title}
                    className="flex items-start gap-4 p-4 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0"
                      style={{
                        background: accent + "20",
                        border: `1px solid ${accent}40`,
                      }}
                    >
                      {icon}
                    </div>
                    <div>
                      <p
                        className="text-sm font-semibold mb-0.5"
                        style={{ color: accent }}
                      >
                        {title}
                      </p>
                      <p className="text-xs text-white/40 leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
