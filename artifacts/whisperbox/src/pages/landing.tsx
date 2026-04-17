import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MessageSquare, Zap, ArrowRight, Crown, Lock, Bell, Send } from "lucide-react";
import { Footer } from "@/components/footer";

const BRAND = {
  mint:     "#86ead4",
  mintDark: "#1a443c",
  mintLight:"#ddf9f2",
  gold:     "#f59e0b",
  success:  "#22c55e",
  info:     "#3b82f6",
  muted:    "#71717a",
  border:   "#e4e4e7",
  bg:       "#ffffff",
  fg:       "#09090b",
  secondary:"#f4f4f5",
};

const tickerItems = [
  { avatar: "A", name: "Agus",  color: BRAND.info,    text: 'baru saja menerima 3 pesan baru' },
  { avatar: "R", name: "Rina",  color: BRAND.gold,    text: 'mendapat pesan: "Kamu itu orangnya asik banget!"' },
  { avatar: "B", name: "Budi",  color: BRAND.mint,    text: 'baru bergabung dan langsung menerima 2 pesan' },
  { avatar: "S", name: "Siti",  color: BRAND.gold,    text: 'upgrade ke Premium — social links aktif' },
  { avatar: "D", name: "Dedi",  color: BRAND.success, text: 'berbagi link ke 200+ followers-nya' },
  { avatar: "N", name: "Nina",  color: BRAND.info,    text: 'mendapat pertanyaan jujur dari temannya' },
  { avatar: "F", name: "Fajar", color: BRAND.success, text: 'membalas 5 pesan anonim hari ini' },
  { avatar: "M", name: "Maya",  color: BRAND.mint,    text: 'aktivasi notifikasi email untuk pesan baru' },
  { avatar: "H", name: "Hadi",  color: BRAND.info,    text: 'profil dikunjungi 48 kali minggu ini' },
  { avatar: "Y", name: "Yuna",  color: BRAND.gold,    text: 'mendapat pesan: "Tetap semangat ya!"' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#09090b] selection:bg-[#86ead4] selection:text-[#1a443c]">
      <style>{`
        @keyframes ticker {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .landing-ticker {
          animation: ticker 26s linear infinite;
        }
        .landing-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 w-full border-b border-[#e4e4e7] bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-[#09090b] text-white flex items-center justify-center text-sm font-bold">
              W
            </div>
            WhisperBox
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm font-medium text-[#71717a]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ backgroundColor: BRAND.success }} />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5"
                      style={{ backgroundColor: BRAND.success }} />
              </span>
              Layanan Aktif
            </div>
            <div className="h-4 w-px bg-[#e4e4e7] hidden md:block" />
            <Link href="/sign-in">
              <span className="text-sm font-medium hover:text-[#71717a] transition-colors cursor-pointer">Masuk</span>
            </Link>
            <Link href="/sign-up">
              <Button className="rounded-full font-semibold border-0 hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: BRAND.mint, color: BRAND.mintDark }}>
                Mulai Gratis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* ── Hero ── */}
        <section className="pt-24 pb-16 md:pt-32 md:pb-24 px-4 overflow-hidden">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">

              {/* Left */}
              <div className="flex flex-col gap-6 max-w-xl relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium w-fit border border-[#e4e4e7] bg-white shadow-sm">
                  <span className="flex h-2 w-2 rounded-full" style={{ backgroundColor: BRAND.success }} />
                  Lebih dari 12.400+ pengguna aktif
                </div>

                <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]">
                  Terima pesan <br />
                  <span className="relative inline-block mt-2">
                    <span className="relative z-10 px-2">tanpa batas.</span>
                    <span className="absolute bottom-1 left-0 w-full h-4 -z-10 -rotate-1"
                          style={{ backgroundColor: BRAND.mint }} />
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-[#71717a] leading-relaxed">
                  Platform pesan anonim teraman untuk jujur-jujuran bareng teman, followers, atau siapapun. Tanpa basa-basi.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-2">
                  <Link href="/sign-up">
                    <Button size="lg"
                      className="rounded-full text-base font-semibold h-14 px-8 border-0 hover:opacity-90 transition-opacity flex items-center gap-2"
                      style={{ backgroundColor: BRAND.mint, color: BRAND.mintDark,
                               boxShadow: `0 10px 30px ${BRAND.mint}40` }}>
                      Buat Link-mu <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/sign-in">
                    <Button size="lg" variant="outline"
                      className="rounded-full text-base font-medium h-14 px-8 border-[#e4e4e7] bg-white hover:bg-[#f4f4f5] text-[#09090b]">
                      Sudah punya akun
                    </Button>
                  </Link>
                </div>

                <p className="text-sm text-[#71717a] font-medium flex items-center gap-2 mt-4">
                  Tidak perlu kartu kredit · Gratis selamanya · Setup 30 detik
                </p>
              </div>

              {/* Right – Inbox Card */}
              <div className="relative mx-auto w-full max-w-md">
                <div className="absolute inset-0 rounded-3xl blur-3xl opacity-30 bg-gradient-to-tr from-[#86ead4] to-[#3b82f6]" />
                <div className="relative bg-white border border-[#e4e4e7] rounded-3xl p-6 shadow-2xl flex flex-col gap-4">

                  {/* Profile row */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#ddf9f2] flex items-center justify-center font-bold"
                           style={{ color: BRAND.mintDark }}>W</div>
                      <div>
                        <div className="font-semibold text-sm">Inbox Kamu</div>
                        <div className="text-xs text-[#71717a]">@username</div>
                      </div>
                    </div>
                    <div className="px-2 py-1 rounded-full text-xs font-bold border"
                         style={{ borderColor: BRAND.gold, color: BRAND.gold,
                                  backgroundColor: `${BRAND.gold}10` }}>
                      1 Baru
                    </div>
                  </div>

                  {/* Message 1 */}
                  <div className="bg-[#f4f4f5] rounded-2xl p-4 border border-[#e4e4e7] relative overflow-hidden group cursor-pointer hover:border-[#86ead4] transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#71717a]">
                        <Lock className="w-3 h-3" /> Anonim
                      </div>
                      <div className="text-xs text-[#71717a]">Baru saja</div>
                    </div>
                    <p className="font-medium text-lg mb-4">
                      "Menurutku karya lu yang kemaren keren banget sih, bikin lagi dong! 🙌"
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" className="rounded-full h-8 px-4 text-xs font-medium"
                              style={{ backgroundColor: BRAND.mint, color: BRAND.mintDark }}>
                        Balas
                      </Button>
                      <Button size="sm" variant="ghost"
                              className="rounded-full h-8 px-4 text-xs font-medium text-[#71717a] hover:text-[#09090b]">
                        Bagikan
                      </Button>
                    </div>
                  </div>

                  {/* Message 2 – blurred */}
                  <div className="bg-[#f4f4f5] rounded-2xl p-4 border border-[#e4e4e7] opacity-50 grayscale">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#71717a]">
                        <Lock className="w-3 h-3" /> Anonim
                      </div>
                      <div className="text-xs text-[#71717a]">2 jam lalu</div>
                    </div>
                    <p className="font-medium blur-sm select-none">Pesan rahasia ini disembunyikan untuk privasi.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Feature Cards ── */}
        <section className="py-20 bg-[#f4f4f5] border-y border-[#e4e4e7]">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Simpel, Aman, Cepat.</h2>
              <p className="text-[#71717a] text-lg">Semua yang kamu butuhkan untuk mulai menerima pesan anonim hari ini.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-white rounded-3xl p-8 border border-[#e4e4e7] shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-[#f4f4f5] flex items-center justify-center mb-6">
                  <Lock className="w-6 h-6 text-[#09090b]" />
                </div>
                <h3 className="text-xl font-bold mb-3">100% Anonim</h3>
                <p className="text-[#71717a] leading-relaxed">
                  Privasi pengirim dijamin aman. Kami tidak melacak IP atau data pribadi pengirim pesan tanpa izin.
                </p>
              </div>

              {/* Card 2 – highlighted */}
              <div className="rounded-3xl p-8 border shadow-lg relative overflow-hidden transform md:-translate-y-4"
                   style={{ backgroundColor: BRAND.mint, borderColor: `${BRAND.mintDark}20` }}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-bl-full blur-2xl" />
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-inner"
                     style={{ backgroundColor: BRAND.mintDark }}>
                  <Zap className="w-6 h-6" style={{ color: BRAND.mint }} />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: BRAND.mintDark }}>Terima Instan</h3>
                <p className="leading-relaxed font-medium" style={{ color: `${BRAND.mintDark}cc` }}>
                  Pesan langsung masuk ke inbox-mu detik itu juga. Aktifkan notifikasi biar nggak ketinggalan.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-3xl p-8 border border-[#e4e4e7] shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-[#f4f4f5] flex items-center justify-center mb-6">
                  <MessageSquare className="w-6 h-6 text-[#09090b]" />
                </div>
                <h3 className="text-xl font-bold mb-3">Link Personalmu</h3>
                <p className="text-[#71717a] leading-relaxed">
                  Klaim username unikmu dan pasang di bio Instagram, TikTok, atau Twitter dengan mudah.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── How it Works ── */}
        <section className="py-24 px-4 bg-white">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 tracking-tight">Cara Kerjanya</h2>

            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-[#e4e4e7] -z-10" />

              {[
                { n: "1", title: "Buat akun gratis",      desc: "Daftar dalam 30 detik dan klaim username unik yang kamu banget." },
                { n: "2", title: "Bagikan link-mu",        desc: "Taruh link-mu di bio IG, Twitter, TikTok, atau status WA kamu." },
                { n: "3", title: "Terima pesan anonim",    desc: "Baca pesan yang masuk dan balas langsung ke social media-mu." },
              ].map(({ n, title, desc }) => (
                <div key={n} className="flex flex-col items-center text-center relative">
                  <div className="w-24 h-24 rounded-full border-[6px] border-white flex items-center justify-center text-3xl font-black mb-6 shadow-sm z-10"
                       style={{ backgroundColor: BRAND.mint, color: BRAND.mintDark }}>
                    {n}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{title}</h3>
                  <p className="text-[#71717a]">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="py-12 border-y border-[#e4e4e7] bg-[#fafafa]">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { val: "12.400+", label: "pengguna aktif" },
                { val: "94.000+", label: "pesan terkirim" },
                { val: "100%",    label: "anonim & aman"  },
                { val: "Gratis",  label: "untuk memulai"  },
              ].map(({ val, label }) => (
                <div key={label} className="text-center px-4">
                  <div className="text-3xl font-black mb-1">{val}</div>
                  <div className="text-sm font-medium text-[#71717a]">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Activity ── */}
        <section className="py-24 px-4 bg-white overflow-hidden">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">

              {/* Left text */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold w-fit mb-6"
                     style={{ backgroundColor: `${BRAND.success}15`, color: BRAND.success }}>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                          style={{ backgroundColor: BRAND.success }} />
                    <span className="relative inline-flex rounded-full h-2 w-2"
                          style={{ backgroundColor: BRAND.success }} />
                  </span>
                  Live Activity
                </div>

                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
                  Ribuan orang sudah aktif hari ini.
                </h2>
                <p className="text-lg text-[#71717a] mb-8 leading-relaxed">
                  Bergabunglah dengan komunitas yang berkembang pesat. Lihat apa yang sedang terjadi secara real-time di WhisperBox.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/sign-up">
                    <Button size="lg" className="rounded-full text-base font-semibold h-12 px-6 border-0"
                            style={{ backgroundColor: BRAND.mint, color: BRAND.mintDark }}>
                      Ikut Bergabung
                    </Button>
                  </Link>
                  <Link href="/sign-in">
                    <Button size="lg" variant="outline"
                            className="rounded-full text-base font-medium h-12 px-6 border-[#e4e4e7]">
                      Sudah punya akun
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right – Ticker */}
              <div className="relative h-[400px] w-full max-w-md mx-auto rounded-3xl border border-[#e4e4e7] bg-[#fafafa] shadow-inner overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#fafafa] to-transparent z-10" />
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#fafafa] to-transparent z-10" />

                <div className="landing-ticker pt-4">
                  {[...tickerItems, ...tickerItems].map((item, i) => (
                    <div key={i}
                         className="flex items-start gap-4 p-4 mx-4 mb-3 bg-white border border-[#e4e4e7] rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white shadow-inner"
                           style={{ backgroundColor: item.color }}>
                        {item.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-sm mb-0.5">{item.name}</div>
                        <div className="text-sm text-[#71717a] leading-tight">{item.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="py-24 px-4 bg-white">
          <div className="container mx-auto max-w-5xl">
            <div className="rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden"
                 style={{ backgroundColor: BRAND.mint }}>
              <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 rounded-full mix-blend-overlay opacity-50 blur-3xl"
                   style={{ backgroundColor: BRAND.mintLight }} />
              <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 rounded-full mix-blend-overlay opacity-50 blur-3xl"
                   style={{ backgroundColor: BRAND.mintDark }} />

              <div className="relative z-10 flex flex-col items-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-white shadow-sm mb-8"
                     style={{ color: BRAND.gold }}>
                  <Crown className="w-4 h-4 fill-current" />
                  Tersedia juga versi Premium
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-8"
                    style={{ color: BRAND.mintDark }}>
                  Siap menerima kejujuran?
                </h2>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Link href="/sign-up">
                    <Button size="lg"
                      className="rounded-full text-base font-bold h-14 px-8 border-0 bg-[#09090b] text-white hover:bg-[#27272a] shadow-xl">
                      Buat Akun Sekarang
                    </Button>
                  </Link>
                  <Link href="/upgrade">
                    <Button size="lg" variant="outline"
                      className="rounded-full text-base font-bold h-14 px-8 border-2 hover:bg-[#1a443c]/5"
                      style={{ borderColor: `${BRAND.mintDark}30`, color: BRAND.mintDark }}>
                      Pelajari Lebih Lanjut
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
