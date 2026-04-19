import { Link } from "wouter";
import {
  UserPlus,
  Share2,
  MessageSquare,
  CornerUpLeft,
  Crown,
  CheckCircle2,
} from "lucide-react";
import { StaticPageLayout } from "@/components/static-page-layout";
import { useSiteBranding } from "@/hooks/use-branding";

const STEPS = [
  {
    number: "01",
    icon: UserPlus,
    title: "Buat Akun Gratis",
    desc: "Daftar menggunakan email atau akun Google kamu. Proses setup hanya butuh waktu 30 detik.",
    tips: [
      "Tidak perlu kartu kredit",
      "Langsung aktif setelah daftar",
      "Link personal otomatis dibuat",
    ],
  },
  {
    number: "02",
    icon: Share2,
    title: "Bagikan Link Personalmu",
    desc: "Setiap akun mendapat link unik seperti secretme.site/u/namakamu. Bagikan ke media sosial, bio Instagram, atau kirim langsung ke teman.",
    tips: [
      "Format: secretme.site/u/username",
      "Bisa langsung disalin dari dashboard",
      "Cocok untuk bio semua platform",
    ],
  },
  {
    number: "03",
    icon: MessageSquare,
    title: "Terima Pesan Anonim",
    desc: "Siapapun bisa kirim pesan ke linkmu tanpa login dan tanpa meninggalkan identitas. Pesan langsung masuk ke dashboardmu secara real-time.",
    tips: [
      "Pengirim 100% anonim",
      "Notifikasi email untuk pesan baru",
      "Bisa filter & cari pesan",
    ],
  },
  {
    number: "04",
    icon: CornerUpLeft,
    title: "Balas Jika Mau",
    desc: "Kamu bisa membalas pesan secara publik — balasanmu akan muncul di bawah pesan di halaman profilmu. Semua orang bisa lihat, tapi tetap tidak tahu siapa pengirimnya.",
    tips: [
      "Balasan tampil di profil publik",
      "Bisa edit atau hapus balasan",
      "Pengirim bisa dapat notifikasi via email",
    ],
  },
];

const PREMIUM_FEATURES = [
  "Tambah link sosial media di profil",
  "Aktifkan notifikasi email balasan untuk pengirim",
  "Notifikasi email pesan baru",
  "Tampilan profil yang lebih lengkap",
];

export default function CaraPakaiPage() {
  const { data: branding } = useSiteBranding();
  const appName = branding?.appName ?? "vooi.lol";

  return (
    <StaticPageLayout>
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-4xl mx-auto px-5 py-14 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            Panduan Penggunaan
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
            Cara pakai {appName}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-lg mx-auto">
            Mulai terima pesan anonim dalam 4 langkah mudah. Tidak ada yang
            rumit di sini.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="border-b border-border">
        <div className="max-w-4xl mx-auto px-5 py-14">
          <div className="space-y-8">
            {STEPS.map(({ number, icon: Icon, title, desc, tips }, idx) => (
              <div key={number} className="flex gap-5 sm:gap-7">
                {/* Number + line */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
                    {number}
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className="w-px flex-1 bg-border mt-3" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-8 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-primary" />
                    <h2 className="text-base font-bold text-foreground">
                      {title}
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {desc}
                  </p>
                  <ul className="space-y-1.5">
                    {tips.map((tip) => (
                      <li
                        key={tip}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium */}
      <section className="border-b border-border">
        <div className="max-w-4xl mx-auto px-5 py-14">
          <div className="rounded-md border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-bold text-amber-800">
                Lebih banyak dengan Premium
              </h2>
            </div>
            <p className="text-xs text-amber-700 mb-4 leading-relaxed">
              Upgrade ke Premium untuk membuka fitur-fitur eksklusif yang
              membuat profilmu makin lengkap dan interaktif.
            </p>
            <ul className="space-y-2 mb-5">
              {PREMIUM_FEATURES.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-xs text-amber-800"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/upgrade"
              className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-md text-xs font-semibold hover:bg-amber-600 transition-colors"
            >
              <Crown className="w-3.5 h-3.5" />
              Lihat Paket Premium
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="max-w-4xl mx-auto px-5 py-14 text-center">
          <h2 className="text-xl font-bold text-foreground mb-3">
            Siap mulai?
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Buat akunmu sekarang dan mulai terima pesan pertamamu hari ini.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Daftar Gratis →
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 border border-border bg-white text-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:bg-secondary/50 transition-colors"
            >
              Lihat FAQ
            </Link>
          </div>
        </div>
      </section>
    </StaticPageLayout>
  );
}
