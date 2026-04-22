import { Link } from "wouter";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, X, Crown } from "lucide-react";
import { useAuth } from "@clerk/react";
import { Footer } from "@/components/footer";
import { SiteLogoImg } from "@/components/site-logo";
import { useSiteBranding } from "@/hooks/use-branding";
import { BrandName } from "@/components/brand-name";
import { useAppConfig } from "@/hooks/use-app-config";

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
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ─── Activity ticker ─── */
const ACTIVITIES = [
  {
    avatar: "A",
    name: "Agus",
    color: "#14b8a6",
    text: "baru saja menerima 3 pesan baru",
    tag: "🔔",
    time: "2 mnt lalu",
  },
  {
    avatar: "R",
    name: "Rina",
    color: "#6366f1",
    text: 'mendapat pesan: "Kamu itu orangnya asik banget!"',
    tag: "💬",
    time: "5 mnt lalu",
  },
  {
    avatar: "B",
    name: "Budi",
    color: "#0ea5e9",
    text: "baru bergabung dan langsung menerima 2 pesan",
    tag: "⚡",
    time: "11 mnt lalu",
  },
  {
    avatar: "S",
    name: "Siti",
    color: "#8b5cf6",
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
    color: "#f59e0b",
    text: "mendapat pertanyaan jujur dari temannya",
    tag: "💭",
    time: "31 mnt lalu",
  },
  {
    avatar: "F",
    name: "Fajar",
    color: "#14b8a6",
    text: "membalas 5 pesan anonim hari ini",
    tag: "↩️",
    time: "42 mnt lalu",
  },
  {
    avatar: "M",
    name: "Maya",
    color: "#6366f1",
    text: "aktivasi notifikasi email untuk pesan baru",
    tag: "📧",
    time: "1 jam lalu",
  },
];
const TICKER_ITEMS = [...ACTIVITIES, ...ACTIVITIES];
const ITEM_H = 72;
const ITEM_GAP = 8;
const VISIBLE = 4;
const TICKER_H = VISIBLE * (ITEM_H + ITEM_GAP) - ITEM_GAP;

function ActivityTicker() {
  return (
    <div
      className="overflow-hidden relative"
      style={{
        height: TICKER_H,
        maskImage:
          "linear-gradient(to bottom, transparent, #000 16%, #000 84%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent, #000 16%, #000 84%, transparent)",
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
            className="flex items-center gap-3 px-4 bg-white border border-border rounded-xl shrink-0"
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

/* ─── Hero mockup ─── */
function HeroMockup() {
  return (
    <div className="relative flex justify-center items-center">
      <div
        className="hero-card-float relative w-full max-w-[340px] bg-white border border-border overflow-hidden rounded-2xl"
        style={{
          boxShadow: "0 20px 60px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <div className="px-5 pt-4 pb-3 border-b border-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0 overflow-hidden ring-1 ring-border">
            <img
              src="/banks/budi.jpg"
              alt="Budi"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground leading-none">
              Budi Santoso
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              @budi_s · 47 pesan diterima
            </p>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
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
        <div className="mx-4 mb-4 overflow-hidden rounded-xl border border-border">
          <div className="px-4 pt-3 pb-2 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0">
              <svg
                className="w-3 h-3 text-muted-foreground"
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
            <span className="text-xs font-semibold text-muted-foreground">
              Anonim
            </span>
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
          <div className="px-4 py-2.5 border-t border-border flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-[11px] font-semibold text-primary bg-primary/8 px-2.5 py-1.5 rounded-lg">
              ↩ Balas
            </button>
            <button className="flex items-center gap-1.5 text-[11px] text-muted-foreground bg-secondary/50 px-2.5 py-1.5 rounded-lg">
              ↑ Bagikan
            </button>
          </div>
        </div>
        <div className="mx-4 mb-4 px-4 py-2.5 border border-dashed border-border bg-secondary/20 flex items-center gap-3 rounded-xl">
          <div className="flex -space-x-1.5">
            {["#6366f1", "#14b8a6", "#f59e0b"].map((c, i) => (
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
            +2 pesan baru menunggumu
          </p>
          <span className="text-[10px] font-semibold text-primary">
            Lihat →
          </span>
        </div>
      </div>
      <div className="absolute -top-3 -right-3 md:-right-6 bg-white border border-border shadow-lg px-3 py-1.5 flex items-center gap-2 msg-bubble-1 rounded-xl">
        <div className="w-5 h-5 bg-primary/10 flex items-center justify-center shrink-0 text-[10px] rounded-md">
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

/* ─── Profile Preview mockup ─── */
function ProfileMockup() {
  return (
    <div
      className="w-full max-w-xs bg-white border border-border rounded-2xl overflow-hidden mx-auto"
      style={{
        boxShadow: "0 16px 48px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.03)",
      }}
    >
      <div className="px-6 pt-7 pb-5 text-center border-b border-border">
        <div className="w-14 h-14 rounded-full bg-primary mx-auto flex items-center justify-center text-primary-foreground text-lg font-bold mb-3 overflow-hidden ring-1 ring-border">
          <img
            src="/banks/anisa.jpg"
            alt="Anisa"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
        <p className="font-bold text-foreground text-sm leading-tight">
          Anisa Rahmawati
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">@anisa_r</p>
        <p className="text-xs text-muted-foreground mt-2 max-w-[200px] mx-auto leading-relaxed">
          Kirim pesan jujur untukku, aku baca semua 💌
        </p>
      </div>
      <div className="px-5 py-4">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Kirim Pesan Anonim
        </p>
        <div className="w-full min-h-[64px] rounded-xl border border-border bg-secondary/20 px-3 py-2.5 text-xs text-muted-foreground leading-relaxed">
          Tulis pesanmu di sini... (identitasmu tetap tersembunyi)
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">0 / 500</span>
          <div className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-lg">
            Kirim →
          </div>
        </div>
      </div>
      <div className="px-5 pb-4 pt-2 border-t border-border flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
        Identitas pengirim selalu anonim
      </div>
    </div>
  );
}

/* ─── Premium comparison data ─── */
const FREE_FEATURES = [
  "Foto avatar profil",
  "Username & display name kustom",
  "Bio profil singkat",
  "Terima pesan anonim tak terbatas",
  "Balas pesan",
  "Share message card ke IG/Twitter",
  "Profil publik dengan link personal",
  "Statistik pesan dasar",
];

const PREMIUM_EXTRAS = [
  "Social links (Instagram, TikTok, X, GitHub, LinkedIn, Facebook, dll.)",
  "Notifikasi email otomatis tiap pesan masuk",
  "Notifikasi balasan ke pengirim anonim (opsional)",
  "Badge ✓ Premium eksklusif di profil publik",
  "Kampanye pesan: ajukan pertanyaan ke pengunjung profilmu",
  "Akses Wrapped: ringkasan pesan tahunanmu",
  "Poin referral bonus saat ajak teman upgrade",
  "Prioritas dukungan & fitur baru",
];

function formatRupiah(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}

export default function LandingPage() {
  const { data: branding } = useSiteBranding();
  const appName = branding?.appName ?? "kepoin.me";
  const { isSignedIn } = useAuth();
  const { data: appConfig } = useAppConfig();
  const premiumPrice = appConfig?.premiumPrice ?? 49900;

  const profileRef = useReveal();
  const actRef = useReveal();
  const premiumRef = useReveal();
  const ctaRef = useReveal();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-white text-foreground overflow-x-hidden">
      {/* ── NAVBAR ── */}
      <header className="border-b border-border bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <SiteLogoImg className="w-7 h-7" />
            <BrandName name={appName} className="font-bold tracking-tight" />
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
            HERO
        ══════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-white pt-12 pb-16 md:pt-24 md:pb-28">
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            aria-hidden
          >
            <div
              className="landing-blob-1 absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-30"
              style={{ background: "#86ead4", top: "-15%", left: "-8%" }}
            />
            <div
              className="landing-blob-2 absolute w-[400px] h-[400px] rounded-full blur-3xl opacity-20"
              style={{ background: "#ede9fe", top: "10%", right: "-8%" }}
            />
            <div
              className="absolute inset-0 opacity-[0.35]"
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
            <div className="flex flex-col items-start">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-5 leading-[1.05] text-foreground">
                Pesan jujur,
                <br />
                <span
                  style={{
                    background:
                      "linear-gradient(90deg, #0f9e80 0%, #6366f1 100%)",
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

              <div className="flex flex-row gap-3 w-full sm:w-auto">
                <Link href="/sign-up" className="flex-1 sm:flex-none">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto px-6 text-base font-semibold gap-2"
                  >
                    Buat Link-mu <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/sign-in" className="flex-1 sm:flex-none">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto px-6 text-base"
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

            <div className="relative pt-6 pb-6 flex justify-center">
              <HeroMockup />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            PROFIL PUBLIK
        ══════════════════════════════════════ */}
        <section className="py-24 bg-secondary/30 border-y border-border">
          <div
            ref={profileRef}
            className="reveal-section max-w-5xl mx-auto px-6"
          >
            <div className="grid md:grid-cols-2 gap-14 items-center">
              {/* Left: copy */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                  Profil Publik
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-5">
                  Halamanmu sendiri.
                  <br />
                  <span className="text-primary">
                    Terbuka untuk siapa saja.
                  </span>
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  Satu link, langsung bisa dikirim ke Instagram bio, Twitter,
                  atau grup chat. Tidak perlu akun — siapa pun bisa langsung
                  mengirim pesan anonim untukmu.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Desain bersih, fokus pada pesan",
                    "Avatar & bio sesuai kepribadianmu",
                    "Balas pesan langsung dari profil",
                    "Social links Premium untuk terlihat lebih profesional",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground"
                    >
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/sign-up">
                  <Button className="gap-2 font-semibold">
                    Buat Profilmu <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {/* Right: mockup */}
              <div className="flex justify-center">
                <ProfileMockup />
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            AKTIVITAS LIVE
        ══════════════════════════════════════ */}
        <section className="py-24 bg-white">
          <div ref={actRef} className="reveal-section max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-14 items-center">
              {/* Left: copy */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                  Aktivitas Live
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                  Ribuan orang sudah
                  <br />
                  <span className="text-primary">aktif hari ini</span>
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

              {/* Right: ticker */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Aktivitas Terbaru
                  </p>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Live
                  </span>
                </div>
                <ActivityTicker />
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            PREMIUM vs FREE
        ══════════════════════════════════════ */}
        <section className="py-24 bg-secondary/20 border-y border-border">
          <div
            ref={premiumRef}
            className="reveal-section max-w-4xl mx-auto px-6"
          >
            <div className="text-center mb-12">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                Paket
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Mulai gratis, upgrade kapan saja
              </h2>
              <p className="text-sm text-muted-foreground mt-3 max-w-sm mx-auto">
                Fitur dasar selalu gratis. Premium untuk yang ingin lebih.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Free */}
              <div className="bg-white border border-border rounded-2xl p-7">
                <div className="mb-6">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                    Gratis
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    Rp 0
                    <span className="text-base font-normal text-muted-foreground">
                      {" "}
                      / selamanya
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Semua yang kamu butuhkan untuk memulai
                  </p>
                </div>
                <ul className="space-y-3 mb-7">
                  {FREE_FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-foreground">{f}</span>
                    </li>
                  ))}
                  {PREMIUM_EXTRAS.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2.5 text-sm opacity-40"
                    >
                      <X className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground line-through">
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href="/sign-up" className="block">
                  <Button variant="outline" className="w-full font-semibold">
                    Mulai Gratis
                  </Button>
                </Link>
              </div>

              {/* Premium */}
              <div className="border-2 border-primary rounded-2xl p-7 bg-primary/5 relative overflow-hidden">
                <div className="absolute top-3 right-3">
                  <span className="bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                    Terbaik
                  </span>
                </div>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                      Premium
                    </p>
                    <Crown className="w-3 h-3 text-primary" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">
                    {formatRupiah(premiumPrice)}
                    <span className="text-base font-normal text-muted-foreground">
                      {" "}
                      / seumur hidup
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sekali bayar, semua fitur tanpa langganan bulanan
                  </p>
                </div>
                <ul className="space-y-3 mb-7">
                  {FREE_FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-foreground/70">{f}</span>
                    </li>
                  ))}
                  {PREMIUM_EXTRAS.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-foreground font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/upgrade" className="block">
                  <Button className="w-full font-semibold">
                    Upgrade Premium →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            CTA FINAL
        ══════════════════════════════════════ */}
        <section className="py-24 bg-white">
          <div
            ref={ctaRef}
            className="reveal-section max-w-xl mx-auto px-6 text-center"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <SiteLogoImg className="w-7 h-7" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-[1.15]">
              Siap dengar yang
              <br />
              selama ini tak terucap?
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-sm mx-auto">
              Buat profil dalam 30 detik. Bagikan link-mu. Mulai terima pesan
              anonim dari siapa saja.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/sign-up">
                <Button size="lg" className="px-10 font-semibold gap-2">
                  Buat Akun Gratis <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline" className="px-8">
                  Sudah punya akun
                </Button>
              </Link>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">
              Tidak perlu kartu kredit &nbsp;·&nbsp; Gratis selamanya
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
