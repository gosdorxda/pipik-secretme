import { Link } from "wouter";
import { MessageCircle } from "lucide-react";
import { StaticPageLayout } from "@/components/static-page-layout";
import { useSiteBranding } from "@/hooks/use-branding";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const CONTACT_EMAIL = "hello@whisperbox.id";

function getFaqItems(appName: string) {
  return [
    {
      category: "Umum",
      items: [
        {
          q: `Apa itu ${appName}?`,
          a: `${appName} adalah platform pesan anonim yang memungkinkan kamu menerima pesan, pertanyaan, atau apresiasi dari siapapun — tanpa pengirim perlu mengungkapkan identitasnya.`,
        },
        {
          q: `Apakah ${appName} gratis?`,
          a: `Ya! Kamu bisa menggunakan ${appName} secara gratis selamanya. Ada paket Premium dengan fitur tambahan seperti notifikasi email, link sosial media, dan lainnya — tapi fitur dasar selalu gratis.`,
        },
        {
          q: `Siapa yang bisa menggunakan ${appName}?`,
          a: `Siapapun bisa menggunakan ${appName}. Hanya pemilik profil yang perlu mendaftar — pengirim pesan tidak perlu punya akun sama sekali.`,
        },
      ],
    },
    {
      category: "Privasi & Keamanan",
      items: [
        {
          q: "Apakah identitas pengirim bisa diketahui?",
          a: `Tidak. ${appName} dirancang untuk menjaga anonimitas pengirim. Kami tidak menyimpan, menampilkan, atau membagikan informasi yang bisa mengidentifikasi siapa yang mengirim pesan.`,
        },
        {
          q: "Apakah data saya aman?",
          a: "Ya. Semua data dienkripsi saat transit. Kami tidak pernah menjual data pengguna ke pihak ketiga manapun. Kamu bisa menghapus akun dan semua datanya kapan saja.",
        },
        {
          q: `Apakah ${appName} menyimpan alamat IP pengirim?`,
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
          a: "Premium mencakup: social links di profil (Instagram, TikTok, X, GitHub, dll.), notifikasi email otomatis tiap pesan masuk, notifikasi balasan ke pengirim anonim, badge ✓ Premium eksklusif, kampanye pesan, akses Wrapped, poin referral, dan prioritas dukungan.",
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
          a: `Premium ${appName} saat ini berbasis pembayaran sekali (one-time). Tidak ada langganan berulang yang perlu dibatalkan.`,
        },
      ],
    },
  ];
}

export default function FaqPage() {
  const { data: branding } = useSiteBranding();
  const appName = branding?.appName ?? "vooi.lol";
  const faqItems = getFaqItems(appName);

  return (
    <StaticPageLayout>
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-4xl mx-auto px-5 py-14 text-center">
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
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-primary hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <div className="max-w-4xl mx-auto px-5 py-14 space-y-10">
          {faqItems.map(({ category, items }) => (
            <div key={category}>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                {category}
              </h2>
              <div className="rounded-md border border-border bg-white overflow-hidden divide-y divide-border">
                <Accordion type="single" collapsible>
                  {items.map(({ q, a }, idx) => (
                    <AccordionItem
                      key={q}
                      value={`${category}-${idx}`}
                      className="border-0 last:border-0"
                    >
                      <AccordionTrigger className="px-5 py-4 text-sm font-medium text-foreground hover:no-underline hover:bg-secondary/40 transition-colors text-left">
                        {q}
                      </AccordionTrigger>
                      <AccordionContent className="px-5 pb-4 pt-0 text-sm text-muted-foreground leading-relaxed">
                        {a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="max-w-4xl mx-auto px-5 py-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Masih ada pertanyaan? Kami siap membantu.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
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
