import { Link } from "wouter";
import {
  MessageSquareHeart,
  Shield,
  Zap,
  Heart,
  Users,
  Lock,
} from "lucide-react";
import { StaticPageLayout } from "@/components/static-page-layout";

const STATS = [
  { label: "Pengguna Aktif", value: "10.000+" },
  { label: "Pesan Terkirim", value: "500.000+" },
  { label: "Negara Pengguna", value: "12+" },
];

const VALUES = [
  {
    icon: Lock,
    title: "Privasi Utama",
    desc: "Kami tidak pernah menyimpan identitas pengirim. Setiap pesan benar-benar anonim — bahkan untuk kami sendiri.",
  },
  {
    icon: Shield,
    title: "Aman & Terpercaya",
    desc: "Data dienkripsi, sistem diproteksi, dan kami tidak pernah menjual data pengguna ke pihak manapun.",
  },
  {
    icon: Zap,
    title: "Sederhana & Cepat",
    desc: "Tidak perlu install app. Cukup bagikan linkmu, dan siapapun bisa langsung kirim pesan dalam hitungan detik.",
  },
  {
    icon: Heart,
    title: "Dibuat dengan Cinta",
    desc: "WhisperBox lahir dari kebutuhan nyata — ruang aman untuk mendengar pendapat jujur tanpa rasa takut.",
  },
];

export default function TentangPage() {
  return (
    <StaticPageLayout>
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-3xl mx-auto px-5 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <MessageSquareHeart className="w-3.5 h-3.5" />
            Tentang WhisperBox
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
            Ruang aman untuk{" "}
            <span className="text-primary">kejujuran anonim</span>
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
            WhisperBox adalah platform pesan anonim asal Indonesia yang
            memungkinkan kamu menerima pendapat jujur, pertanyaan tulus, dan
            apresiasi tulus — semua tanpa nama, semua tanpa rasa takut.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border">
        <div className="max-w-3xl mx-auto px-5 py-10">
          <div className="grid grid-cols-3 gap-6 text-center">
            {STATS.map(({ label, value }) => (
              <div key={label}>
                <p className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                  {value}
                </p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="border-b border-border">
        <div className="max-w-3xl mx-auto px-5 py-14">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-3">
              Cerita Kami
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed space-y-4">
            <p className="text-foreground text-base font-medium">
              WhisperBox lahir dari pertanyaan sederhana: bagaimana kalau kamu
              bisa tahu apa yang orang lain sebenarnya pikirkan tentang kamu?
            </p>
            <p>
              Seringkali kejujuran yang paling berharga justru tidak terucapkan
              — karena takut menyinggung, takut dihakimi, atau takut hubungan
              menjadi awkward. WhisperBox hadir sebagai jembatan: memberikan
              keberanian kepada pengirim melalui anonimitas, sekaligus
              memberikan ruang aman kepada penerima untuk benar-benar mendengar.
            </p>
            <p>
              Kami percaya bahwa umpan balik yang jujur — baik pujian maupun
              kritik — adalah hadiah. Dan WhisperBox memastikan hadiah itu bisa
              tersampaikan tanpa hambatan.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-b border-border">
        <div className="max-w-3xl mx-auto px-5 py-14">
          <h2 className="text-lg font-bold text-foreground mb-8 text-center">
            Nilai yang Kami Pegang
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-md border border-border bg-secondary/30 p-5 flex gap-4"
              >
                <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">
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
      </section>

      {/* CTA */}
      <section>
        <div className="max-w-3xl mx-auto px-5 py-14 text-center">
          <Users className="w-8 h-8 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-3">
            Bergabung bersama ribuan pengguna WhisperBox
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Buat link personalmu sekarang — gratis, tanpa perlu kartu kredit.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Mulai Sekarang →
          </Link>
        </div>
      </section>
    </StaticPageLayout>
  );
}
