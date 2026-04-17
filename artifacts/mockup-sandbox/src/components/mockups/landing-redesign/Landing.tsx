import React from "react";
import { MessageSquare, Shield, Zap, ArrowRight, Crown, Lock, Bell, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Landing() {
  const brandColors = {
    mint: "#86ead4",
    mintDark: "#1a443c",
    mintLight: "#ddf9f2",
    gold: "#f59e0b",
    success: "#22c55e",
    info: "#3b82f6",
    destructive: "#ef4444",
    background: "#ffffff",
    foreground: "#09090b",
    muted: "#71717a",
    border: "#e4e4e7",
  };

  const tickerItems = [
    { avatar: "A", name: "Agus", color: brandColors.info, text: "baru saja menerima 3 pesan baru" },
    { avatar: "R", name: "Rina", color: brandColors.gold, text: 'mendapat pesan: "Kamu itu orangnya asik banget!"' },
    { avatar: "B", name: "Budi", color: brandColors.mint, text: "baru bergabung dan langsung menerima 2 pesan" },
    { avatar: "S", name: "Siti", color: brandColors.gold, text: "upgrade ke Premium — social links aktif" },
    { avatar: "D", name: "Dedi", color: brandColors.success, text: "berbagi link ke 200+ followers-nya" },
    { avatar: "N", name: "Nina", color: brandColors.info, text: "mendapat pertanyaan jujur dari temannya" },
    { avatar: "F", name: "Fajar", color: brandColors.success, text: "membalas 5 pesan anonim hari ini" },
    { avatar: "M", name: "Maya", color: brandColors.mint, text: "aktivasi notifikasi email untuk pesan baru" },
    { avatar: "H", name: "Hadi", color: brandColors.info, text: "profil dikunjungi 48 kali minggu ini" },
    { avatar: "Y", name: "Yuna", color: brandColors.gold, text: 'mendapat pesan: "Tetap semangat ya!"' },
  ];

  return (
    <div className="font-['Space_Grotesk'] min-h-screen bg-[#ffffff] text-[#09090b] selection:bg-[#86ead4] selection:text-[#1a443c]">
      <style>{`
        @keyframes ticker {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .animate-ticker {
          animation: ticker 26s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* 1. Sticky Nav */}
      <nav className="sticky top-0 z-50 w-full border-b border-[#e4e4e7] bg-[#ffffff]/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
          <a href="#" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded bg-[#09090b] text-white flex items-center justify-center">
              W
            </div>
            <span>WhisperBox</span>
          </a>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm font-medium text-[#71717a]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: brandColors.success }}></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: brandColors.success }}></span>
              </span>
              <span>Layanan Aktif</span>
            </div>
            <div className="h-4 w-px bg-[#e4e4e7] hidden md:block"></div>
            <a href="#" className="text-sm font-medium hover:text-[#71717a] transition-colors">Masuk</a>
            <Button className="rounded-full font-semibold border-0 hover:opacity-90 transition-opacity" style={{ backgroundColor: brandColors.mint, color: brandColors.mintDark }}>
              Mulai Gratis
            </Button>
          </div>
        </div>
      </nav>

      <main>
        {/* 2. Hero Section */}
        <section className="pt-24 pb-16 md:pt-32 md:pb-24 px-4 overflow-hidden">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col gap-6 max-w-xl relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium w-fit border border-[#e4e4e7] bg-[#ffffff] shadow-sm">
                  <span className="flex h-2 w-2 rounded-full" style={{ backgroundColor: brandColors.success }}></span>
                  Lebih dari 12.400+ pengguna aktif
                </div>
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]">
                  Terima pesan <br/>
                  <span className="relative inline-block mt-2">
                    <span className="relative z-10 px-2">tanpa batas.</span>
                    <span className="absolute bottom-1 left-0 w-full h-4 -z-10 -rotate-1" style={{ backgroundColor: brandColors.mint }}></span>
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-[#71717a] leading-relaxed">
                  Platform pesan anonim teraman untuk jujur-jujuran bareng teman, followers, atau siapapun. Tanpa basa-basi.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-2">
                  <Button size="lg" className="rounded-full text-base font-semibold h-14 px-8 border-0 hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-[#86ead4]/20" style={{ backgroundColor: brandColors.mint, color: brandColors.mintDark }}>
                    Buat Link-mu <ArrowRight className="w-5 h-5" />
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full text-base font-medium h-14 px-8 border-[#e4e4e7] bg-white hover:bg-[#f4f4f5] text-[#09090b]">
                    Sudah punya akun
                  </Button>
                </div>
                <p className="text-sm text-[#71717a] font-medium flex items-center gap-2 mt-4">
                  Tidak perlu kartu kredit · Gratis selamanya · Setup 30 detik
                </p>
              </div>

              <div className="relative mx-auto w-full max-w-md">
                <div className="absolute inset-0 rounded-3xl blur-3xl opacity-30 bg-gradient-to-tr from-[#86ead4] to-[#3b82f6]"></div>
                <div className="relative bg-[#ffffff] border border-[#e4e4e7] rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#ddf9f2] flex items-center justify-center font-bold" style={{ color: brandColors.mintDark }}>
                        W
                      </div>
                      <div>
                        <div className="font-semibold text-sm">Inbox Kamu</div>
                        <div className="text-xs text-[#71717a]">@username</div>
                      </div>
                    </div>
                    <div className="px-2 py-1 rounded-full text-xs font-bold border" style={{ borderColor: brandColors.gold, color: brandColors.gold, backgroundColor: `${brandColors.gold}10` }}>
                      1 Baru
                    </div>
                  </div>
                  
                  <div className="bg-[#f4f4f5] rounded-2xl p-4 border border-[#e4e4e7] relative overflow-hidden group cursor-pointer hover:border-[#86ead4] transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#71717a]">
                        <Lock className="w-3 h-3" /> Anonim
                      </div>
                      <div className="text-xs text-[#71717a]">Baru saja</div>
                    </div>
                    <p className="font-medium text-lg mb-4">"Menurutku karya lu yang kemaren keren banget sih, bikin lagi dong! 🙌"</p>
                    <div className="flex gap-2">
                      <Button size="sm" className="rounded-full h-8 px-4 text-xs font-medium" style={{ backgroundColor: brandColors.mint, color: brandColors.mintDark }}>
                        Balas
                      </Button>
                      <Button size="sm" variant="ghost" className="rounded-full h-8 px-4 text-xs font-medium text-[#71717a] hover:text-[#09090b]">
                        Bagikan
                      </Button>
                    </div>
                  </div>
                  
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

        {/* 3. Feature Cards */}
        <section className="py-20 bg-[#f4f4f5] border-y border-[#e4e4e7]">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Simpel, Aman, Cepat.</h2>
              <p className="text-[#71717a] text-lg">Semua yang kamu butuhkan untuk mulai menerima pesan anonim hari ini.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#ffffff] rounded-3xl p-8 border border-[#e4e4e7] shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-[#f4f4f5] flex items-center justify-center mb-6">
                  <Lock className="w-6 h-6 text-[#09090b]" />
                </div>
                <h3 className="text-xl font-bold mb-3">100% Anonim</h3>
                <p className="text-[#71717a] leading-relaxed">
                  Privasi pengirim dijamin aman. Kami tidak melacak IP atau data pribadi pengirim pesan tanpa izin.
                </p>
              </div>
              
              <div className="bg-[#86ead4] rounded-3xl p-8 border border-[#1a443c]/10 shadow-lg relative overflow-hidden transform md:-translate-y-4">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-bl-full blur-2xl"></div>
                <div className="w-12 h-12 rounded-2xl bg-[#1a443c] flex items-center justify-center mb-6 shadow-inner">
                  <Zap className="w-6 h-6 text-[#86ead4]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#1a443c]">Terima Instan</h3>
                <p className="text-[#1a443c]/80 leading-relaxed font-medium">
                  Pesan langsung masuk ke inbox-mu detik itu juga. Aktifkan notifikasi biar nggak ketinggalan.
                </p>
              </div>
              
              <div className="bg-[#ffffff] rounded-3xl p-8 border border-[#e4e4e7] shadow-sm hover:shadow-md transition-shadow">
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

        {/* 4. How it works */}
        <section className="py-24 px-4 bg-[#ffffff]">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 tracking-tight">Cara Kerjanya</h2>
            
            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-[#e4e4e7] -z-10"></div>
              
              <div className="flex flex-col items-center text-center relative">
                <div className="w-24 h-24 rounded-full border-[6px] border-[#ffffff] flex items-center justify-center text-3xl font-black mb-6 shadow-sm z-10" style={{ backgroundColor: brandColors.mint, color: brandColors.mintDark }}>
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Buat akun gratis</h3>
                <p className="text-[#71717a]">Daftar dalam 30 detik dan klaim username unik yang kamu banget.</p>
              </div>
              
              <div className="flex flex-col items-center text-center relative">
                <div className="w-24 h-24 rounded-full border-[6px] border-[#ffffff] flex items-center justify-center text-3xl font-black mb-6 shadow-sm z-10" style={{ backgroundColor: brandColors.mint, color: brandColors.mintDark }}>
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">Bagikan link-mu</h3>
                <p className="text-[#71717a]">Taruh link-mu di bio IG, Twitter, TikTok, atau status WA kamu.</p>
              </div>
              
              <div className="flex flex-col items-center text-center relative">
                <div className="w-24 h-24 rounded-full border-[6px] border-[#ffffff] flex items-center justify-center text-3xl font-black mb-6 shadow-sm z-10" style={{ backgroundColor: brandColors.mint, color: brandColors.mintDark }}>
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Terima pesan anonim</h3>
                <p className="text-[#71717a]">Baca pesan yang masuk dan balas langsung ke social media-mu.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Stats Strip */}
        <section className="py-12 border-y border-[#e4e4e7] bg-[#fafafa]">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-[#e4e4e7]/0 md:divide-[#e4e4e7]">
              <div className="text-center px-4">
                <div className="text-3xl font-black mb-1">12.400+</div>
                <div className="text-sm font-medium text-[#71717a]">pengguna aktif</div>
              </div>
              <div className="text-center px-4">
                <div className="text-3xl font-black mb-1">94.000+</div>
                <div className="text-sm font-medium text-[#71717a]">pesan terkirim</div>
              </div>
              <div className="text-center px-4">
                <div className="text-3xl font-black mb-1">100%</div>
                <div className="text-sm font-medium text-[#71717a]">anonim & aman</div>
              </div>
              <div className="text-center px-4">
                <div className="text-3xl font-black mb-1">Gratis</div>
                <div className="text-sm font-medium text-[#71717a]">untuk memulai</div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Activity Section */}
        <section className="py-24 px-4 bg-[#ffffff] overflow-hidden">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold w-fit mb-6" style={{ backgroundColor: `${brandColors.success}15`, color: brandColors.success }}>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: brandColors.success }}></span>
                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: brandColors.success }}></span>
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
                  <Button size="lg" className="rounded-full text-base font-semibold h-12 px-6 border-0" style={{ backgroundColor: brandColors.mint, color: brandColors.mintDark }}>
                    Ikut Bergabung
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full text-base font-medium h-12 px-6 border-[#e4e4e7]">
                    Lihat Fitur Lainnya
                  </Button>
                </div>
              </div>

              <div className="relative h-[400px] w-full max-w-md mx-auto rounded-3xl border border-[#e4e4e7] bg-[#fafafa] shadow-inner overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#fafafa] to-transparent z-10"></div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#fafafa] to-transparent z-10"></div>
                
                <div className="animate-ticker pt-4">
                  {[...tickerItems, ...tickerItems].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 mx-4 mb-3 bg-[#ffffff] border border-[#e4e4e7] rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white shadow-inner" style={{ backgroundColor: item.color }}>
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

        {/* 7. CTA Banner */}
        <section className="py-24 px-4 bg-[#ffffff]">
          <div className="container mx-auto max-w-5xl">
            <div className="rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden" style={{ backgroundColor: brandColors.mint }}>
              <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 rounded-full mix-blend-overlay opacity-50 blur-3xl" style={{ backgroundColor: brandColors.mintLight }}></div>
              <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 rounded-full mix-blend-overlay opacity-50 blur-3xl" style={{ backgroundColor: brandColors.mintDark }}></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-[#ffffff] shadow-sm mb-8" style={{ color: brandColors.gold }}>
                  <Crown className="w-4 h-4 fill-current" />
                  Tersedia juga versi Premium
                </div>
                
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-8" style={{ color: brandColors.mintDark }}>
                  Siap menerima kejujuran?
                </h2>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Button size="lg" className="rounded-full text-base font-bold h-14 px-8 border-0 bg-[#09090b] text-[#ffffff] hover:bg-[#27272a] shadow-xl">
                    Buat Akun Sekarang
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full text-base font-bold h-14 px-8 border-2 border-[#1a443c]/20 hover:bg-[#1a443c]/5" style={{ color: brandColors.mintDark }}>
                    Pelajari Lebih Lanjut
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 8. Footer */}
      <footer className="border-t border-[#e4e4e7] py-8 bg-[#ffffff] text-center">
        <div className="container mx-auto px-4">
          <p className="text-[#71717a] font-medium text-sm">© 2025 WhisperBox. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
