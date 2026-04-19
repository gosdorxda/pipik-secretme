import { Link } from "wouter";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Crown } from "lucide-react";
import { useAuth } from "@clerk/react";
import { Footer } from "@/components/footer";
import { SiteLogoImg } from "@/components/site-logo";

/* ─── Scroll reveal hook ─── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          obs.unobserve(el);
        }
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ─── Activity ticker data ─── */
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
const ITEM_H = 76;
const ITEM_GAP = 8;
const VISIBLE = 4;
const TICKER_H = VISIBLE * (ITEM_H + ITEM_GAP) - ITEM_GAP;

function ActivityTicker() {
  return (
    <div
      className="rounded-2xl overflow-hidden relative border border-border"
      style={{
        height: TICKER_H,
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(8px)",
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
            style={{ height: ITEM_H, minHeight: ITEM_H }}
            className="flex items-center gap-3 px-3 bg-white border border-border rounded-xl shrink-0 shadow-sm"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ backgroundColor: item.color }}
            >
              {item.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">
                <span className="font-semibold">{item.name}</span>{" "}
                <span className="text-muted-foreground">{item.text}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {item.time}
              </p>
            </div>
            <span className="text-base shrink-0 leading-none">{item.tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Hero mockup (light theme) ─── */
function HeroMockup() {
  const msgStripe = "linear-gradient(to right, #86ead4, #60c4ae)";
  const msgBg = "rgba(134,234,212,0.10)";
  const msgBorder = "rgba(134,234,212,0.38)";
  return (
    <div className="relative flex justify-center items-center">
      <div
        className="hero-card-float relative w-full max-w-[360px] bg-white border border-border overflow-hidden rounded-2xl"
        style={{
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.08), 0 4px 16px rgba(134,234,212,0.18)",
        }}
      >
        <div className="px-5 pt-4 pb-3 border-b border-border flex items-center gap-3 bg-accent/30">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
            B
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground leading-none">
              Budi Santoso
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              @budi_s · 47 pesan diterima
            </p>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-semibold bg-accent text-accent-foreground px-2 py-0.5 rounded-md border border-primary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            Live
          </div>
        </div>
        <div className="px-5 pt-3 pb-2 flex items-center gap-2">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
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
            <span
              className="text-xs font-semibold"
              style={{ color: "#6d28d9" }}
            >
              Anonim
            </span>
            <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
            <span className="text-[10px] text-muted-foreground ml-auto">
              2 jam lalu
            </span>
          </div>
          <div className="px-4 pb-3">
            <p className="text-sm leading-relaxed text-foreground">
              Kamu itu orangnya sangat menyenangkan, selalu bisa bikin orang
              senyum 😊
            </p>
          </div>
          <div
            className="px-4 pb-3 pt-1 border-t flex items-center gap-2"
            style={{ borderColor: msgBorder }}
          >
            <button
              className="flex items-center gap-1.5 text-[11px] font-semibold text-accent-foreground bg-white/70 border px-2.5 py-1.5 rounded-lg hover:bg-white transition-colors"
              style={{ borderColor: msgBorder }}
            >
              ↩ Balas
            </button>
            <button
              className="flex items-center gap-1.5 text-[11px] text-muted-foreground bg-white/50 border px-2.5 py-1.5 rounded-lg"
              style={{ borderColor: msgBorder }}
            >
              ↑ Bagikan
            </button>
          </div>
        </div>
        <div className="msg-bubble-2 mx-4 mb-4 px-4 py-2.5 border border-dashed border-border bg-secondary/30 flex items-center gap-3 rounded-xl">
          <div className="flex -space-x-1.5">
            {["#8b5cf6", "#3b82f6", "#f43f5e"].map((c, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center"
                style={{ background: c, zIndex: 3 - i }}
              >
                <span className="text-white text-[8px] font-bold">?</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground flex-1">
            +2 pesan baru lainnya menunggumu
          </p>
          <span className="text-[10px] font-semibold text-accent-foreground">
            Lihat →
          </span>
        </div>
      </div>
      <div
        className="absolute -top-3 -right-3 md:-right-8 bg-white border border-border shadow-lg px-3 py-1.5 flex items-center gap-2 msg-bubble-1 rounded-xl"
        style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
      >
        <div className="w-5 h-5 bg-primary flex items-center justify-center shrink-0 text-[10px] rounded-md">
          💬
        </div>
        <div>
          <p className="text-[10px] font-semibold text-foreground leading-none">
            Pesan baru!
          </p>
          <p className="text-[9px] text-muted-foreground mt-0.5">
            dari seseorang anonim
          </p>
        </div>
      </div>
    </div>
  );
}

const STATS = [
  {
    value: "12.400+",
    label: "Pengguna aktif",
    color: "#0f9e80",
    bg: "#ddf9f2",
    border: "#86ead4",
  },
  {
    value: "94.000+",
    label: "Pesan terkirim",
    color: "#6d28d9",
    bg: "#ede9fe",
    border: "#c4b5fd",
  },
  {
    value: "100%",
    label: "Anonim & aman",
    color: "#0369a1",
    bg: "#e0f2fe",
    border: "#7dd3fc",
  },
  {
    value: "Gratis",
    label: "Untuk memulai",
    color: "#be123c",
    bg: "#ffe4e6",
    border: "#fda4af",
  },
];

const FEATURES = [
  {
    icon: "🔒",
    title: "100% Anonim",
    desc: "Pengirim tidak pernah teridentifikasi. Tanpa tracking, tanpa IP logging — selamanya.",
    bg: "#fdf4ff",
    border: "#e9d5ff",
    iconBg: "#ede9fe",
    accent: "#7c3aed",
  },
  {
    icon: "⚡",
    title: "Terima Instan",
    desc: "Pesan muncul di inbox-mu begitu dikirim. Real-time, tanpa delay, langsung notif.",
    bg: "#f0fdf9",
    border: "#86ead4",
    iconBg: "#ddf9f2",
    accent: "#0f9e80",
    featured: true,
  },
  {
    icon: "🔗",
    title: "Link Personalmu",
    desc: "Satu link untuk dibagikan ke mana saja — siapa pun bisa kirim pesan tanpa akun.",
    bg: "#f0f9ff",
    border: "#7dd3fc",
    iconBg: "#e0f2fe",
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
    textColor: "#0f9e80",
  },
  {
    step: "02",
    title: "Bagikan link-mu",
    desc: "Share ke bio Instagram, Twitter, atau ke teman-temanmu langsung.",
    emoji: "🔗",
    color: "#c4b5fd",
    textColor: "#7c3aed",
  },
  {
    step: "03",
    title: "Terima pesan anonim",
    desc: "Semua pesan masuk ke dashboard-mu. Identitas pengirim selalu tersembunyi.",
    emoji: "💬",
    color: "#7dd3fc",
    textColor: "#0369a1",
  },
];

export default function LandingPage() {
  const { isSignedIn } = useAuth();

  const featRef = useReveal();
  const howRef = useReveal();
  const statsRef = useReveal();
  const actRef = useReveal();
  const ctaRef = useReveal();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-white text-foreground overflow-x-hidden">
      {/* ── NAVBAR ── */}
      <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <SiteLogoImg className="w-7 h-7" />
            <span className="font-bold text-foreground tracking-tight">
              vooi<span className="text-accent-foreground">.lol</span>
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
                  <Button variant="ghost" size="sm">
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
        {/* ══════════════════════════════════════
            HERO — white with animated color blobs
        ══════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-white pt-24 pb-28">
          {/* Animated gradient blobs */}
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            aria-hidden
          >
            <div
              className="landing-blob-1 absolute w-[560px] h-[560px] rounded-full blur-3xl opacity-35"
              style={{ background: "#86ead4", top: "-15%", left: "-8%" }}
            />
            <div
              className="landing-blob-2 absolute w-[480px] h-[480px] rounded-full blur-3xl opacity-25"
              style={{ background: "#ede9fe", top: "10%", right: "-8%" }}
            />
            <div
              className="landing-blob-3 absolute w-[400px] h-[400px] rounded-full blur-3xl opacity-20"
              style={{ background: "#bae6fd", bottom: "0%", left: "35%" }}
            />
            {/* Dot grid */}
            <div
              className="absolute inset-0 opacity-[0.45]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #86ead420 1.5px, transparent 1.5px)",
                backgroundSize: "28px 28px",
                maskImage:
                  "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
              }}
            />
          </div>

          <div className="relative max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 md:gap-8 items-center">
            {/* Left */}
            <div className="flex flex-col items-start">
              <div
                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-6"
                style={{
                  background: "#ddf9f2",
                  border: "1px solid #86ead4",
                  color: "#0f9e80",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                12.400+ pengguna aktif di Indonesia
              </div>

              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-5 leading-[1.05] text-foreground">
                Pesan jujur,
                <br />
                <span
                  style={{
                    background:
                      "linear-gradient(90deg, #0f9e80 0%, #7c3aed 60%, #0369a1 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  tanpa batas.
                </span>
              </h1>

              <p className="text-base text-muted-foreground mb-8 max-w-md leading-relaxed">
                Bagikan link personalmu. Siapa saja bisa kirim pesan anonim —
                tanpa akun, tanpa identitas. Semua masuk ke dashboard-mu secara
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
                    variant="outline"
                    className="px-8 text-base"
                  >
                    Sudah punya akun
                  </Button>
                </Link>
              </div>

              <p className="mt-5 text-xs text-muted-foreground">
                Tidak perlu kartu kredit &nbsp;·&nbsp; Gratis selamanya
                &nbsp;·&nbsp; Setup 30 detik
              </p>
            </div>

            {/* Right: mockup */}
            <div className="relative pt-6 pb-6 flex justify-center">
              <HeroMockup />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            FEATURES — light bg, colored cards
        ══════════════════════════════════════ */}
        <section
          className="relative py-24 overflow-hidden"
          style={{ background: "#fafafa" }}
        >
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            aria-hidden
          >
            <div
              className="landing-blob-slow absolute w-96 h-96 rounded-full blur-3xl opacity-30"
              style={{ background: "#ede9fe", top: "-10%", right: "5%" }}
            />
            <div
              className="landing-blob-slow2 absolute w-80 h-80 rounded-full blur-3xl opacity-20"
              style={{ background: "#ddf9f2", bottom: "0", left: "10%" }}
            />
          </div>

          <div
            ref={featRef}
            className="reveal-section relative max-w-5xl mx-auto px-6"
          >
            <div className="text-center mb-12">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                Kenapa vooi.lol?
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Dirancang untuk kejujuran
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {FEATURES.map((f, i) => (
                <div
                  key={f.title}
                  className="reveal-card relative p-7 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                  style={{
                    background: f.bg,
                    border: `1px solid ${f.border}`,
                    animationDelay: `${i * 100}ms`,
                    boxShadow: f.featured
                      ? `0 8px 32px ${f.border}60`
                      : "0 2px 12px rgba(0,0,0,0.04)",
                  }}
                >
                  {f.featured && (
                    <div
                      className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: f.accent, color: "white" }}
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

        {/* ══════════════════════════════════════
            HOW IT WORKS
        ══════════════════════════════════════ */}
        <section className="relative py-24 bg-white overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div
              className="landing-blob-1 absolute w-72 h-72 rounded-full blur-3xl opacity-20"
              style={{ background: "#bae6fd", bottom: "5%", right: "-5%" }}
            />
          </div>

          <div
            ref={howRef}
            className="reveal-section relative max-w-5xl mx-auto px-6"
          >
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
              {HOW_STEPS.map(
                ({ step, title, desc, emoji, color, textColor }, i) => (
                  <div
                    key={step}
                    className="reveal-card flex flex-col items-center text-center gap-4"
                    style={{ animationDelay: `${i * 120}ms` }}
                  >
                    <div
                      className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center z-10 transition-transform hover:scale-105"
                      style={{
                        background: color + "30",
                        border: `2px solid ${color}`,
                      }}
                    >
                      <span className="text-2xl">{emoji}</span>
                      <span
                        className="text-[10px] font-bold tracking-widest mt-0.5"
                        style={{ color: textColor }}
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
                ),
              )}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            STATS — light tinted
        ══════════════════════════════════════ */}
        <section
          className="relative py-20 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #f0fdf9 0%, #fdf4ff 50%, #f0f9ff 100%)",
          }}
        >
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div
              className="landing-blob-2 absolute w-96 h-96 rounded-full blur-3xl opacity-40"
              style={{ background: "#86ead4", top: "-30%", left: "-5%" }}
            />
            <div
              className="landing-blob-3 absolute w-80 h-80 rounded-full blur-3xl opacity-30"
              style={{ background: "#ede9fe", bottom: "-20%", right: "-5%" }}
            />
          </div>

          <div
            ref={statsRef}
            className="reveal-section relative max-w-5xl mx-auto px-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map(({ value, label, color, bg, border }) => (
                <div
                  key={label}
                  className="reveal-card flex flex-col items-center gap-3 p-6 rounded-2xl text-center"
                  style={{ background: bg, border: `1px solid ${border}` }}
                >
                  <p
                    className="text-4xl md:text-5xl font-bold"
                    style={{ color }}
                  >
                    {value}
                  </p>
                  <p
                    className="text-xs font-medium"
                    style={{ color, opacity: 0.65 }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            ACTIVITY — white with accent blobs
        ══════════════════════════════════════ */}
        <section className="relative py-24 bg-white overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div
              className="landing-blob-slow absolute w-[480px] h-[480px] rounded-full blur-3xl opacity-20"
              style={{ background: "#c4b5fd", top: "-10%", right: "-10%" }}
            />
            <div
              className="landing-blob-slow2 absolute w-72 h-72 rounded-full blur-3xl opacity-15"
              style={{ background: "#86ead4", bottom: "0", left: "0" }}
            />
          </div>

          <div
            ref={actRef}
            className="reveal-section relative max-w-5xl mx-auto px-6"
          >
            <div className="grid md:grid-cols-2 gap-14 items-center">
              <div>
                <div
                  className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-5"
                  style={{
                    background: "#e0f2fe",
                    border: "1px solid #7dd3fc",
                    color: "#0369a1",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                  Aktivitas Live
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                  Ribuan orang sudah
                  <br />
                  <span
                    style={{
                      background: "linear-gradient(90deg, #0f9e80, #7c3aed)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    aktif hari ini
                  </span>
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-7">
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
                    <Button variant="outline" className="gap-2">
                      Masuk ke akun
                    </Button>
                  </Link>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Aktivitas Terbaru
                  </p>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                    Live
                  </span>
                </div>
                <ActivityTicker />
                <p className="text-xs text-muted-foreground text-center mt-3 opacity-60">
                  Data ilustrasi — bukan data pengguna nyata
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            CTA — light mint-to-violet gradient
        ══════════════════════════════════════ */}
        <section
          className="relative py-20 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #ddf9f2 0%, #f5f3ff 50%, #e0f2fe 100%)",
          }}
        >
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div
              className="landing-blob-1 absolute w-96 h-96 rounded-full blur-3xl opacity-50"
              style={{ background: "#86ead4", top: "-20%", left: "-5%" }}
            />
            <div
              className="landing-blob-2 absolute w-80 h-80 rounded-full blur-3xl opacity-40"
              style={{ background: "#ede9fe", bottom: "-10%", right: "-5%" }}
            />
            <div
              className="absolute inset-0 opacity-[0.4]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #86ead450 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
          </div>

          <div
            ref={ctaRef}
            className="reveal-section relative max-w-5xl mx-auto px-6"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-white/80 border border-border text-foreground text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                  <Crown className="w-3 h-3 text-accent-foreground" /> Tersedia
                  juga versi Premium
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-[1.15]">
                  Siap menerima
                  <br />
                  <span
                    style={{
                      background:
                        "linear-gradient(90deg, #0f9e80 0%, #7c3aed 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    kejujuran?
                  </span>
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-xs">
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
                    <Button size="lg" variant="outline" className="px-8">
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
                    bg: "#fdf4ff",
                    border: "#e9d5ff",
                    color: "#7c3aed",
                  },
                  {
                    icon: "⚡",
                    title: "Terima Pesan Instan",
                    desc: "Pesan langsung muncul di inbox-mu begitu dikirim.",
                    bg: "#f0fdf9",
                    border: "#86ead4",
                    color: "#0f9e80",
                  },
                  {
                    icon: "🔗",
                    title: "Link Personal-mu",
                    desc: "Satu link untuk dibagikan ke mana saja.",
                    bg: "#f0f9ff",
                    border: "#7dd3fc",
                    color: "#0369a1",
                  },
                ].map(({ icon, title, desc, bg, border, color }) => (
                  <div
                    key={title}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white/70 border border-border shadow-sm backdrop-blur-sm"
                    style={{ background: bg, border: `1px solid ${border}` }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0"
                      style={{
                        background: "white",
                        border: `1px solid ${border}`,
                      }}
                    >
                      {icon}
                    </div>
                    <div>
                      <p
                        className="text-sm font-semibold mb-0.5"
                        style={{ color }}
                      >
                        {title}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
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
