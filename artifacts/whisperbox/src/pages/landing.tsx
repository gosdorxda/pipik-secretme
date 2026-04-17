import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MessageSquare, Zap, ArrowRight, Crown, Lock } from "lucide-react";
import { Footer } from "@/components/footer";

const BRAND = {
  mint:     "#86ead4",
  mintDark: "#1a443c",
  mintLight:"#ddf9f2",
  gold:     "#f59e0b",
  success:  "#22c55e",
  info:     "#3b82f6",
};

const tickerItems = [
  { avatar: "A", name: "Agus",  color: BRAND.info,    text: "baru saja menerima 3 pesan baru" },
  { avatar: "R", name: "Rina",  color: BRAND.gold,    text: 'mendapat pesan: "Kamu itu orangnya asik banget!"' },
  { avatar: "B", name: "Budi",  color: BRAND.mint,    text: "baru bergabung dan langsung menerima 2 pesan" },
  { avatar: "S", name: "Siti",  color: BRAND.gold,    text: "upgrade ke Premium — social links aktif" },
  { avatar: "D", name: "Dedi",  color: BRAND.success, text: "berbagi link ke 200+ followers-nya" },
  { avatar: "N", name: "Nina",  color: BRAND.info,    text: "mendapat pertanyaan jujur dari temannya" },
  { avatar: "F", name: "Fajar", color: BRAND.success, text: "membalas 5 pesan anonim hari ini" },
  { avatar: "M", name: "Maya",  color: BRAND.mint,    text: "aktivasi notifikasi email untuk pesan baru" },
  { avatar: "H", name: "Hadi",  color: BRAND.info,    text: "profil dikunjungi 48 kali minggu ini" },
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
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <div className="w-6 h-6 rounded-lg bg-[#09090b] text-white flex items-center justify-center text-xs font-bold">
              W
            </div>
            WhisperBox
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 text-xs font-medium text-[#71717a]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ backgroundColor: BRAND.success }} />
                <span className="relative inline-flex rounded-full h-2 w-2"
                      style={{ backgroundColor: BRAND.success }} />
              </span>
              Layanan Aktif
            </div>
            <div className="h-4 w-px bg-[#e4e4e7] hidden md:block" />
            <Link href="/sign-in">
              <span className="text-xs font-medium text-[#71717a] hover:text-[#09090b] transition-colors cursor-pointer">Masuk</span>
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="rounded-full text-xs font-semibold h-8 px-4 border-0"
                      style={{ backgroundColor: BRAND.mint, color: BRAND.mintDark }}>
                Mulai Gratis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* ── Hero ── */}
        <section className="py-16 md:py-20 px-6 overflow-hidden">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-center">

              {/* Left */}
              <div className="flex flex-col gap-5 max-w-sm">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium w-fit border border-[#e4e4e7] bg-white shadow-sm">
                  <span className="flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: BRAND.success }} />
                  12.400+ pengguna aktif
                </div>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-[1.15]">
                  Terima pesan{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10">tanpa batas.</span>
                    <span className="absolute bottom-0.5 left-0 w-full h-3 -z-10 -rotate-1"
                          style={{ backgroundColor: BRAND.mint }} />
                  </span>
                </h1>

                <p className="text-sm text-[#71717a] leading-relaxed">
                  Platform pesan anonim teraman untuk jujur-jujuran bareng teman, followers, atau siapapun. Tanpa basa-basi.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/sign-up">
                    <Button className="rounded-full text-sm font-semibold h-10 px-6 border-0 flex items-center gap-2"
                            style={{ backgroundColor: BRAND.mint, color: BRAND.mintDark,
                                     boxShadow: `0 4px 16px ${BRAND.mint}50` }}>
                      Buat Link-mu <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/sign-in">
                    <Button variant="outline"
                            className="rounded-full text-sm font-medium h-10 px-6 border-[#e4e4e7] bg-white hover:bg-[#f4f4f5] text-[#09090b]">
                      Sudah punya akun
                    </Button>
                  </Link>
                </div>

                <p className="text-xs text-[#71717a]">
                  Tidak perlu kartu kredit · Gratis selamanya · Setup 30 detik
                </p>
              </div>

              {/* Right – Inbox Card */}
              <div className="relative mx-auto w-full max-w-xs">
                <div className="absolute inset-0 rounded-3xl blur-2xl opacity-25 bg-gradient-to-tr from-[#86ead4] to-[#3b82f6]" />
                <div className="relative bg-white border border-[#e4e4e7] rounded-3xl p-5 shadow-xl flex flex-col gap-3">

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#ddf9f2] flex items-center justify-center font-bold text-sm"
                           style={{ color: BRAND.mintDark }}>W</div>
                      <div>
                        <div className="font-semibold text-xs">Inbox Kamu</div>
                        <div className="text-[10px] text-[#71717a]">@username</div>
                      </div>
                    </div>
                    <div className="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                         style={{ borderColor: BRAND.gold, color: BRAND.gold, backgroundColor: `${BRAND.gold}10` }}>
                      1 Baru
                    </div>
                  </div>

                  <div className="bg-[#f4f4f5] rounded-2xl p-3.5 border border-[#e4e4e7] cursor-pointer hover:border-[#86ead4] transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-1 text-[10px] font-semibold text-[#71717a]">
                        <Lock className="w-2.5 h-2.5" /> Anonim
                      </div>
                      <div className="text-[10px] text-[#71717a]">Baru saja</div>
                    </div>
                    <p className="text-sm font-medium mb-3">
                      "Menurutku karya lu yang kemaren keren banget sih, bikin lagi dong! 🙌"
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" className="rounded-full h-7 px-3 text-[10px] font-medium"
                              style={{ backgroundColor: BRAND.mint, color: BRAND.mintDark }}>
                        Balas
                      </Button>
                      <Button size="sm" variant="ghost"
                              className="rounded-full h-7 px-3 text-[10px] font-medium text-[#71717a]">
                        Bagikan
                      </Button>
                    </div>
                  </div>

                  <div className="bg-[#f4f4f5] rounded-2xl p-3.5 border border-[#e4e4e7] opacity-50 grayscale">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-1 text-[10px] font-semibold text-[#71717a]">
                        <Lock className="w-2.5 h-2.5" /> Anonim
                      </div>
                      <div className="text-[10px] text-[#71717a]">2 jam lalu</div>
                    </div>
                    <p className="text-xs font-medium blur-sm select-none">Pesan rahasia ini disembunyikan.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Feature Cards ── */}
        <section className="py-14 bg-[#f4f4f5] border-y border-[#e4e4e7]">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-xl font-bold tracking-tight mb-2">Simpel, Aman, Cepat.</h2>
              <p className="text-sm text-[#71717a]">Semua yang kamu butuhkan untuk mulai menerima pesan anonim hari ini.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-6 border border-[#e4e4e7] shadow-sm hover:shadow-md transition-shadow">
                <div className="w-9 h-9 rounded-xl bg-[#f4f4f5] flex items-center justify-center mb-4">
                  <Lock className="w-4 h-4 text-[#09090b]" />
                </div>
                <h3 className="text-sm font-bold mb-1.5">100% Anonim</h3>
                <p className="text-xs text-[#71717a] leading-relaxed">
                  Privasi pengirim dijamin aman. Kami tidak melacak IP atau data pribadi pengirim.
                </p>
              </div>

              <div className="rounded-2xl p-6 border shadow-md relative overflow-hidden transform md:-translate-y-3"
                   style={{ backgroundColor: BRAND.mint, borderColor: `${BRAND.mintDark}20` }}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-bl-full blur-2xl" />
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                     style={{ backgroundColor: BRAND.mintDark }}>
                  <Zap className="w-4 h-4" style={{ color: BRAND.mint }} />
                </div>
                <h3 className="text-sm font-bold mb-1.5" style={{ color: BRAND.mintDark }}>Terima Instan</h3>
                <p className="text-xs leading-relaxed" style={{ color: `${BRAND.mintDark}cc` }}>
                  Pesan langsung masuk ke inbox-mu detik itu juga. Aktifkan notifikasi biar nggak ketinggalan.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#e4e4e7] shadow-sm hover:shadow-md transition-shadow">
                <div className="w-9 h-9 rounded-xl bg-[#f4f4f5] flex items-center justify-center mb-4">
                  <MessageSquare className="w-4 h-4 text-[#09090b]" />
                </div>
                <h3 className="text-sm font-bold mb-1.5">Link Personalmu</h3>
                <p className="text-xs text-[#71717a] leading-relaxed">
                  Klaim username unikmu dan pasang di bio Instagram, TikTok, atau Twitter.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── How it Works ── */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-center mb-12 tracking-tight">Cara Kerjanya</h2>

            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-8 left-[18%] right-[18%] border-t-2 border-dashed border-[#e4e4e7] -z-10" />

              {[
                { n: "1", title: "Buat akun gratis",      desc: "Daftar dalam 30 detik dan klaim username unikmu." },
                { n: "2", title: "Bagikan link-mu",        desc: "Taruh di bio IG, Twitter, TikTok, atau status WA." },
                { n: "3", title: "Terima pesan anonim",    desc: "Baca pesan masuk dan balas ke social media-mu." },
              ].map(({ n, title, desc }) => (
                <div key={n} className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center text-xl font-black mb-4 shadow-sm z-10"
                       style={{ backgroundColor: BRAND.mint, color: BRAND.mintDark }}>
                    {n}
                  </div>
                  <h3 className="text-sm font-bold mb-1">{title}</h3>
                  <p className="text-xs text-[#71717a]">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="py-10 border-y border-[#e4e4e7] bg-[#fafafa]">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { val: "12.400+", label: "pengguna aktif" },
                { val: "94.000+", label: "pesan terkirim" },
                { val: "100%",    label: "anonim & aman"  },
                { val: "Gratis",  label: "untuk memulai"  },
              ].map(({ val, label }) => (
                <div key={label}>
                  <div className="text-2xl font-black mb-1">{val}</div>
                  <div className="text-xs font-medium text-[#71717a]">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Activity ── */}
        <section className="py-16 px-6 bg-white overflow-hidden">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-center">

              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold w-fit mb-4"
                     style={{ backgroundColor: `${BRAND.success}15`, color: BRAND.success }}>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                          style={{ backgroundColor: BRAND.success }} />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5"
                          style={{ backgroundColor: BRAND.success }} />
                  </span>
                  Live Activity
                </div>

                <h2 className="text-2xl font-bold tracking-tight mb-3 leading-tight">
                  Ribuan orang sudah aktif hari ini.
                </h2>
                <p className="text-sm text-[#71717a] mb-6 leading-relaxed">
                  Bergabunglah dengan komunitas yang berkembang pesat. Lihat apa yang sedang terjadi secara real-time di WhisperBox.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/sign-up">
                    <Button className="rounded-full text-sm font-semibold h-9 px-5 border-0"
                            style={{ backgroundColor: BRAND.mint, color: BRAND.mintDark }}>
                      Ikut Bergabung
                    </Button>
                  </Link>
                  <Link href="/sign-in">
                    <Button variant="outline"
                            className="rounded-full text-sm font-medium h-9 px-5 border-[#e4e4e7]">
                      Sudah punya akun
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative h-[320px] w-full max-w-sm mx-auto rounded-2xl border border-[#e4e4e7] bg-[#fafafa] shadow-inner overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#fafafa] to-transparent z-10" />
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#fafafa] to-transparent z-10" />

                <div className="landing-ticker pt-3">
                  {[...tickerItems, ...tickerItems].map((item, i) => (
                    <div key={i}
                         className="flex items-start gap-3 p-3 mx-3 mb-2 bg-white border border-[#e4e4e7] rounded-xl shadow-sm">
                      <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white text-xs"
                           style={{ backgroundColor: item.color }}>
                        {item.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-xs mb-0.5">{item.name}</div>
                        <div className="text-xs text-[#71717a] leading-tight">{item.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
                 style={{ backgroundColor: BRAND.mint }}>
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 rounded-full mix-blend-overlay opacity-40 blur-3xl"
                   style={{ backgroundColor: BRAND.mintLight }} />
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 rounded-full mix-blend-overlay opacity-40 blur-3xl"
                   style={{ backgroundColor: BRAND.mintDark }} />

              <div className="relative z-10 flex flex-col items-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-white shadow-sm mb-6"
                     style={{ color: BRAND.gold }}>
                  <Crown className="w-3.5 h-3.5 fill-current" />
                  Tersedia juga versi Premium
                </div>

                <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-6"
                    style={{ color: BRAND.mintDark }}>
                  Siap menerima kejujuran?
                </h2>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Link href="/sign-up">
                    <Button className="rounded-full text-sm font-bold h-10 px-6 border-0 bg-[#09090b] text-white hover:bg-[#27272a] shadow-lg">
                      Buat Akun Sekarang
                    </Button>
                  </Link>
                  <Link href="/upgrade">
                    <Button variant="outline"
                            className="rounded-full text-sm font-bold h-10 px-6 border-2 hover:bg-[#1a443c]/5"
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
