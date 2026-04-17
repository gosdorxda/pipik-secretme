import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MessageSquare, Zap, ArrowRight, Crown, Lock } from "lucide-react";
import { Footer } from "@/components/footer";

const BRAND = {
  mint:    "#86ead4",
  mintDark:"#1a443c",
  mintLight:"#ddf9f2",
  gold:    "#f59e0b",
  success: "#22c55e",
  info:    "#3b82f6",
};

const ACTIVITIES = [
  { avatar: "A", name: "Agus",  color: BRAND.info,    text: "baru saja menerima 3 pesan baru",                  tag: "🔔", time: "2 mnt lalu"  },
  { avatar: "R", name: "Rina",  color: BRAND.gold,    text: 'mendapat pesan: "Kamu itu orangnya asik banget!"', tag: "💬", time: "5 mnt lalu"  },
  { avatar: "B", name: "Budi",  color: BRAND.mint,    text: "baru bergabung dan langsung menerima 2 pesan",     tag: "⚡", time: "11 mnt lalu" },
  { avatar: "S", name: "Siti",  color: BRAND.gold,    text: "upgrade ke Premium — social links aktif",          tag: "✨", time: "18 mnt lalu" },
  { avatar: "D", name: "Dedi",  color: BRAND.success, text: "berbagi link ke 200+ followers-nya",               tag: "🔗", time: "24 mnt lalu" },
  { avatar: "N", name: "Nina",  color: BRAND.info,    text: "mendapat pertanyaan jujur dari temannya",          tag: "💭", time: "31 mnt lalu" },
  { avatar: "F", name: "Fajar", color: BRAND.success, text: "membalas 5 pesan anonim hari ini",                 tag: "↩️", time: "42 mnt lalu" },
  { avatar: "M", name: "Maya",  color: BRAND.mint,    text: "aktivasi notifikasi email untuk pesan baru",       tag: "📧", time: "1 jam lalu"  },
  { avatar: "H", name: "Hadi",  color: BRAND.info,    text: "profil dikunjungi 48 kali minggu ini",             tag: "👁️", time: "1 jam lalu"  },
  { avatar: "Y", name: "Yuna",  color: BRAND.gold,    text: 'mendapat pesan: "Tetap semangat ya!"',             tag: "💬", time: "2 jam lalu"  },
];

const TICKER_ITEMS = [...ACTIVITIES, ...ACTIVITIES];
const ITEM_HEIGHT = 80;
const ITEM_GAP = 10;
const ITEM_STEP = ITEM_HEIGHT + ITEM_GAP;
const TICKER_VISIBLE = 4;
const CONTAINER_HEIGHT = TICKER_VISIBLE * ITEM_STEP - ITEM_GAP;

function ActivityTicker() {
  return (
    <div className="rounded-xs border border-border bg-secondary/30 p-3 overflow-hidden relative"
         style={{
           height: CONTAINER_HEIGHT,
           maskImage: "linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent)",
           WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent)",
         }}>
      <div className="activity-ticker" style={{ display: "flex", flexDirection: "column", gap: ITEM_GAP }}>
        {TICKER_ITEMS.map((item, i) => (
          <div
            key={i}
            style={{ height: ITEM_HEIGHT, minHeight: ITEM_HEIGHT }}
            className="flex items-center gap-3 px-3 bg-white border border-border rounded-xs shadow-sm shrink-0"
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
              <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
            </div>
            <span className="text-base shrink-0 leading-none">{item.tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroMockup() {
  const msgStripe = `linear-gradient(to right, ${BRAND.mint}, #60c4ae)`;
  const msgBg = "rgba(134,234,212,0.10)";
  const msgBorder = "rgba(134,234,212,0.38)";

  return (
    <div className="relative flex justify-center items-center">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full opacity-25"
             style={{ background: `radial-gradient(circle, ${BRAND.mint}, transparent 70%)` }} />
      </div>

      <div
        className="hero-card-float relative w-full max-w-[360px] bg-white border border-border overflow-hidden"
        style={{ boxShadow: `0 20px 60px rgba(0,0,0,0.09), 0 4px 16px rgba(134,234,212,0.12)` }}
      >
        {/* Profile header */}
        <div className="px-5 pt-4 pb-3 border-b border-border flex items-center gap-3 bg-primary/5">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
            B
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground leading-none">Budi Santoso</p>
            <p className="text-xs text-muted-foreground mt-0.5">@budi_s · 47 pesan diterima</p>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-semibold bg-accent text-accent-foreground px-2 py-0.5 rounded-xs border border-primary/20">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
                  style={{ backgroundColor: BRAND.success }} />
            Live
          </div>
        </div>

        {/* Inbox label */}
        <div className="px-5 pt-3 pb-2 flex items-center gap-2">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Inbox</span>
          <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-xs leading-none">3</span>
        </div>

        {/* Message card */}
        <div className="mx-4 mb-4 msg-bubble-1 overflow-hidden" style={{ border: `1px solid ${msgBorder}`, background: msgBg }}>
          <div style={{ height: 3, background: msgStripe }} />
          <div className="px-4 pt-3 pb-2 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/80 border border-white flex items-center justify-center shrink-0 shadow-sm">
              <svg className="w-3 h-3 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <span className="text-xs font-semibold text-foreground/70">Anonymous</span>
            <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
            <span className="text-[10px] text-muted-foreground ml-auto">2 jam lalu</span>
          </div>
          <div className="px-4 pb-3">
            <p className="text-sm leading-relaxed text-foreground">
              Kamu itu orangnya sangat menyenangkan, selalu bisa bikin orang senyum 😊
            </p>
          </div>
          <div className="px-4 pb-3 pt-1 border-t flex items-center gap-2" style={{ borderColor: msgBorder }}>
            <button className="flex items-center gap-1.5 text-[11px] font-semibold text-accent-foreground bg-white/70 border px-2.5 py-1.5 hover:bg-white transition-colors" style={{ borderColor: msgBorder }}>
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/>
              </svg>
              Balas
            </button>
            <button className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground bg-white/50 border px-2.5 py-1.5 hover:bg-white transition-colors" style={{ borderColor: msgBorder }}>
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
              </svg>
              Bagikan
            </button>
          </div>
        </div>

        {/* More messages hint */}
        <div className="msg-bubble-2 mx-4 mb-4 px-4 py-2.5 border border-dashed border-border bg-secondary/30 flex items-center gap-3">
          <div className="flex -space-x-1.5">
            {[BRAND.info, BRAND.gold, BRAND.success].map((c, i) => (
              <div key={i} className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center"
                   style={{ background: c, zIndex: 3 - i }}>
                <span className="text-white text-[8px] font-bold">?</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground flex-1">+2 pesan baru lainnya menunggumu</p>
          <span className="text-[10px] font-semibold text-accent-foreground">Lihat →</span>
        </div>
      </div>

      {/* Floating notification badge */}
      <div className="absolute -top-3 -right-3 md:-right-8 bg-white border border-border shadow-lg px-3 py-1.5 flex items-center gap-2 msg-bubble-1"
           style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
        <div className="w-5 h-5 bg-primary flex items-center justify-center shrink-0 text-[10px]">💬</div>
        <div>
          <p className="text-[10px] font-semibold text-foreground leading-none">Pesan baru!</p>
          <p className="text-[9px] text-muted-foreground mt-0.5">dari seseorang anonim</p>
        </div>
      </div>
    </div>
  );
}

const HOW_STEPS = [
  { step: "01", title: "Buat akun gratis",      desc: "Daftar dalam 30 detik. Langsung dapat link personalmu sendiri." },
  { step: "02", title: "Bagikan link-mu",        desc: "Share ke bio Instagram, Twitter, atau ke teman-temanmu langsung." },
  { step: "03", title: "Terima pesan anonim",    desc: "Semua pesan masuk ke dashboard-mu. Identitas pengirim selalu tersembunyi." },
];

const STATS = [
  { value: "12.400+", label: "Pengguna aktif" },
  { value: "94.000+", label: "Pesan terkirim"  },
  { value: "100%",    label: "Anonim & aman"   },
  { value: "Gratis",  label: "Untuk memulai"   },
];

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">

      {/* Nav */}
      <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <div className="w-7 h-7 bg-primary rounded-xs flex items-center justify-center text-primary-foreground text-xs font-bold">
              W
            </div>
            WhisperBox
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ backgroundColor: BRAND.success }} />
              <span className="relative inline-flex rounded-full h-2 w-2"
                    style={{ backgroundColor: BRAND.success }} />
            </span>
            Layanan Aktif
          </div>

          <div className="flex gap-2">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">Masuk</Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">Mulai Gratis</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6">

          {/* Hero */}
          <section className="grid md:grid-cols-2 gap-12 md:gap-8 items-center pt-20 pb-24 relative">
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle, ${BRAND.mint}20 1.5px, transparent 1.5px)`,
                  backgroundSize: "28px 28px",
                  maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
                  WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
                }}
              />
            </div>

            <div className="flex flex-col items-start text-left">
              {/* Social proof badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border border-border bg-white shadow-sm mb-6">
                <span className="flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: BRAND.success }} />
                12.400+ pengguna aktif bergabung
              </div>

              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-5 leading-[1.05] text-foreground">
                Terima pesan<br />
                <span className="relative inline-block mt-1">
                  <span className="relative z-10">tanpa batas.</span>
                  <span className="absolute bottom-1 left-0 w-full h-3 -z-10 -rotate-1"
                        style={{ backgroundColor: `${BRAND.mint}70` }} />
                </span>
              </h1>

              <p className="text-base text-muted-foreground mb-8 max-w-md leading-relaxed">
                Bagikan link personalmu. Siapa saja bisa kirim pesan anonim — tanpa akun, tanpa identitas. Semua masuk ke dashboard-mu secara real-time.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/sign-up">
                  <Button size="lg" className="px-8 text-base font-semibold">
                    Buat Link-mu <ArrowRight className="ml-1 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button size="lg" variant="outline" className="px-8 text-base">
                    Sudah punya akun
                  </Button>
                </Link>
              </div>

              <p className="mt-5 text-xs text-muted-foreground">
                Tidak perlu kartu kredit &nbsp;·&nbsp; Gratis selamanya &nbsp;·&nbsp; Setup 30 detik
              </p>
            </div>

            <div className="relative pt-6 pb-6 flex justify-center">
              <HeroMockup />
            </div>
          </section>

          {/* Feature cards */}
          <section className="grid md:grid-cols-3 gap-4 pb-20">
            <div className="p-6 border border-border bg-white rounded-xs shadow-sm group hover:border-primary/50 hover:shadow-md transition-all duration-200">
              <div className="w-10 h-10 bg-accent rounded-xs flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                <Lock className="w-5 h-5 text-accent-foreground" />
              </div>
              <h3 className="text-sm font-semibold mb-2 text-foreground">100% Anonim</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Pengirim tidak pernah teridentifikasi. Tanpa tracking, tanpa IP logging — selamanya.</p>
            </div>
            <div className="p-6 border border-primary bg-primary rounded-xs shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8 pointer-events-none" />
              <div className="w-10 h-10 bg-white/20 rounded-xs flex items-center justify-center mb-4 relative">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="text-sm font-semibold mb-2 text-primary-foreground">Terima Instan</h3>
              <p className="text-primary-foreground/80 text-sm leading-relaxed">Pesan muncul di inbox-mu begitu dikirim. Real-time, tanpa delay.</p>
            </div>
            <div className="p-6 border border-border bg-white rounded-xs shadow-sm group hover:border-primary/50 hover:shadow-md transition-all duration-200">
              <div className="w-10 h-10 bg-accent rounded-xs flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                <MessageSquare className="w-5 h-5 text-accent-foreground" />
              </div>
              <h3 className="text-sm font-semibold mb-2 text-foreground">Link Personalmu</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Dapatkan link profil yang bisa dibagikan ke mana saja untuk terima pesan.</p>
            </div>
          </section>

          {/* How it works */}
          <section className="pb-20">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Cara Kerja</p>
              <h2 className="text-2xl md:text-3xl font-bold">Mulai dalam 3 langkah mudah</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 relative">
              <div className="hidden md:block absolute top-7 left-[calc(33.33%+1rem)] right-[calc(33.33%+1rem)] h-px border-t border-dashed border-border" />
              {HOW_STEPS.map(({ step, title, desc }) => (
                <div key={step} className="flex flex-col items-center text-center gap-3">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold z-10"
                    style={{ backgroundColor: BRAND.mint, color: BRAND.mintDark }}
                  >
                    {step}
                  </div>
                  <h3 className="font-semibold text-sm">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Stats strip */}
          <section className="border-y border-border py-10 mb-20 bg-secondary/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {STATS.map(({ value, label }) => (
                <div key={label}>
                  <p className="text-3xl md:text-4xl font-bold text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground mt-1.5">{label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Activity section */}
          <section className="pb-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full mb-4 border"
                     style={{
                       backgroundColor: `${BRAND.success}15`,
                       color: BRAND.success,
                       borderColor: `${BRAND.success}30`,
                     }}>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                          style={{ backgroundColor: BRAND.success }} />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5"
                          style={{ backgroundColor: BRAND.success }} />
                  </span>
                  Aktivitas Live
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                  Ribuan orang sudah<br />
                  <span className="text-accent-foreground">aktif hari ini</span>
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  Bergabunglah dengan komunitas yang terus berkembang. Terima masukan jujur, ungkapan rasa, dan pertanyaan yang tidak pernah berani diucapkan langsung.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/sign-up">
                    <Button className="gap-2">
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
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Aktivitas Terbaru</p>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse"
                          style={{ backgroundColor: BRAND.success }} />
                    Live · hover untuk pause
                  </span>
                </div>
                <ActivityTicker />
                <p className="text-xs text-muted-foreground text-center mt-3 opacity-70">
                  Data ilustrasi — bukan data pengguna nyata
                </p>
              </div>
            </div>
          </section>

          {/* CTA Banner */}
          <section className="mb-20">
            <div className="bg-primary rounded-xs p-10 md:p-14 text-center relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
                <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-white/10 rounded-full" />
              </div>
              <div className="relative">
                <div className="inline-flex items-center gap-2 bg-white/20 text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full mb-5">
                  <Crown className="w-3.5 h-3.5" style={{ color: BRAND.gold }} />
                  <span>Tersedia juga versi</span>
                  <span style={{ color: BRAND.gold }} className="font-bold">Premium</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
                  Siap menerima kejujuran?
                </h2>
                <p className="text-primary-foreground/80 text-sm mb-7 max-w-md mx-auto leading-relaxed">
                  Buat link personalmu sekarang, gratis selamanya. Upgrade kapan saja untuk notifikasi email, social links, dan lebih banyak lagi.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/sign-up">
                    <Button variant="secondary" size="lg" className="px-8 font-semibold">
                      Buat Akun Gratis
                    </Button>
                  </Link>
                  <Link href="/upgrade">
                    <Button variant="ghost" size="lg" className="px-8 text-primary-foreground hover:bg-white/15 hover:text-primary-foreground border border-white/30">
                      Lihat Premium
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
