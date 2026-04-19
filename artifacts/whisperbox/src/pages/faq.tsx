import { useState } from "react";
import { Link } from "wouter";
import { ChevronDown, MessageCircle } from "lucide-react";
import { StaticPageLayout } from "@/components/static-page-layout";

const FAQ_ITEMS = [
  {
    category: "Umum",
    items: [
      {
        q: "Apa itu WhisperBox?",
        a: "WhisperBox adalah platform pesan anonim yang memungkinkan kamu menerima pesan, pertanyaan, atau apresiasi dari siapapun — tanpa pengirim perlu mengungkapkan identitasnya.",
      },
      {
        q: "Apakah WhisperBox gratis?",
        a: "Ya! Kamu bisa menggunakan WhisperBox secara gratis selamanya. Ada paket Premium dengan fitur tambahan seperti notifikasi email, link sosial media, dan lainnya — tapi fitur dasar selalu gratis.",
      },
      {
        q: "Siapa yang bisa menggunakan WhisperBox?",
        a: "Siapapun bisa menggunakan WhisperBox. Hanya pemilik profil yang perlu mendaftar — pengirim pesan tidak perlu punya akun sama sekali.",
      },
    ],
  },
  {
    category: "Privasi & Keamanan",
    items: [
      {
        q: "Apakah identitas pengirim bisa diketahui?",
        a: "Tidak. WhisperBox dirancang untuk menjaga anonimitas pengirim. Kami tidak menyimpan, menampilkan, atau membagikan informasi yang bisa mengidentifikasi siapa yang mengirim pesan.",
      },
      {
        q: "Apakah data saya aman?",
        a: "Ya. Semua data dienkripsi saat transit. Kami tidak pernah menjual data pengguna ke pihak ketiga manapun. Kamu bisa menghapus akun dan semua datanya kapan saja.",
      },
      {
        q: "Apakah WhisperBox menyimpan alamat IP pengirim?",
        a: "Kami menyimpan hash dari alamat IP pengirim (bukan IP aslinya) semata-mata untuk keperluan pembatasan spam. Hash ini tidak bisa digunakan untuk mengidentifikasi pengirim.",
      },
      {
        q: "Apakah email saya terlihat oleh pengirim?",
        a: "Tidak. Email kamu hanya digunakan untuk login dan notifikasi. Email tidak pernah ditampilkan kepada siapapun termasuk pengirim pesan.",
      },
    ],
  },
  {
    category: "Fitur",
    items: [
      {
        q: "Bagaimana cara membalas pesan?",
        a: "Masuk ke dashboard, temukan pesan yang ingin dibalas, lalu klik tombol 'Balas'. Balasanmu akan tampil di bawah pesan di halaman profil publikmu.",
      },
      {
        q: "Bisakah saya menghapus pesan yang masuk?",
        a: "Ya. Kamu bisa menghapus pesan apapun dari dashboardmu. Pesan yang dihapus tidak bisa dipulihkan.",
      },
      {
        q: "Apa itu pesan publik?",
        a: "Pesan publik adalah pesan yang juga ditampilkan di halaman profil publikmu sehingga bisa dilihat semua pengunjung. Kamu bisa mengatur apakah pesan baru langsung publik atau tidak di Settings.",
      },
      {
        q: "Bagaimana cara kerja notifikasi email saat ada pesan baru?",
        a: "Aktifkan fitur 'Notifikasi Email' di Settings (fitur Premium). Setiap kali ada pesan masuk, kamu akan mendapat email pemberitahuan ke alamat email yang terdaftar.",
      },
    ],
  },
  {
    category: "Premium",
    items: [
      {
        q: "Apa saja fitur Premium?",
        a: "Premium mencakup: notifikasi email pesan baru, notifikasi balasan untuk pengirim, menambah link sosial media di profil, dan fitur lanjutan lainnya yang terus kami kembangkan.",
      },
      {
        q: "Bagaimana cara upgrade ke Premium?",
        a: "Masuk ke akunmu, lalu buka halaman Upgrade dari menu dashboard. Pilih paket yang sesuai dan ikuti proses pembayaran.",
      },
      {
        q: "Metode pembayaran apa yang diterima?",
        a: "Kami menerima berbagai metode pembayaran lokal Indonesia melalui Tripay, termasuk transfer bank, e-wallet (GoPay, OVO, Dana), dan QRIS.",
      },
      {
        q: "Apakah Premium bisa dibatalkan?",
        a: "Premium WhisperBox saat ini berbasis pembayaran sekali (one-time). Tidak ada langganan berulang yang perlu dibatalkan.",
      },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left"
      >
        <span className="text-sm font-medium text-foreground">{q}</span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <p className="text-sm text-muted-foreground leading-relaxed pb-4">
          {a}
        </p>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <StaticPageLayout>
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-3xl mx-auto px-5 py-14 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <MessageCircle className="w-3.5 h-3.5" />
            FAQ
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
            Pertanyaan yang sering ditanyakan
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-lg mx-auto">
            Tidak menemukan jawaban yang kamu cari? Hubungi kami di{" "}
            <a
              href="mailto:hello@whisperbox.id"
              className="text-primary hover:underline"
            >
              hello@whisperbox.id
            </a>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <div className="max-w-3xl mx-auto px-5 py-14 space-y-10">
          {FAQ_ITEMS.map(({ category, items }) => (
            <div key={category}>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                {category}
              </h2>
              <div className="rounded-md border border-border bg-white divide-y-0">
                {items.map(({ q, a }) => (
                  <FaqItem key={q} q={q} a={a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="max-w-3xl mx-auto px-5 py-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Masih ada pertanyaan? Kami siap membantu.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a
              href="mailto:hello@whisperbox.id"
              className="inline-flex items-center gap-2 border border-border bg-white text-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:bg-secondary/50 transition-colors"
            >
              Hubungi Kami
            </a>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Coba Sekarang →
            </Link>
          </div>
        </div>
      </section>
    </StaticPageLayout>
  );
}
