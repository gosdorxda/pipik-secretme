import { StaticPageLayout } from "@/components/static-page-layout";
import { useSiteBranding } from "@/hooks/use-branding";

const LAST_UPDATED = "19 April 2026";

export default function PrivasiPage() {
  const { data: branding } = useSiteBranding();
  const appName = branding?.appName ?? "vooi.lol";

  return (
    <StaticPageLayout>
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-4xl mx-auto px-5 py-14">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            Kebijakan Privasi
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Kebijakan Privasi {appName}
          </h1>
          <p className="text-sm text-muted-foreground">
            Terakhir diperbarui: {LAST_UPDATED}
          </p>
        </div>
      </section>

      {/* Content */}
      <section>
        <div className="max-w-4xl mx-auto px-5 py-12 space-y-10 text-sm leading-relaxed">
          <div>
            <p className="text-muted-foreground">
              {appName} ("kami", "kita", atau "layanan") berkomitmen untuk
              melindungi privasi penggunanya. Kebijakan ini menjelaskan data apa
              yang kami kumpulkan, bagaimana kami menggunakannya, dan hak-hak
              kamu sebagai pengguna.
            </p>
          </div>

          <Section title="1. Data yang Kami Kumpulkan">
            <SubSection title="A. Pengguna yang mendaftar (pemilik profil)">
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Alamat email (untuk login dan notifikasi)</li>
                <li>Nama tampilan dan username yang kamu pilih</li>
                <li>Foto profil (jika diunggah)</li>
                <li>Preferensi dan pengaturan akun</li>
                <li>Riwayat transaksi jika kamu upgrade ke Premium</li>
              </ul>
            </SubSection>
            <SubSection title="B. Pengirim pesan (tanpa akun)">
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  Hash dari alamat IP (bukan IP asli) untuk keperluan pembatasan
                  spam
                </li>
                <li>Isi pesan yang dikirimkan</li>
                <li>
                  Alamat email (opsional, hanya jika pengirim memilih untuk
                  mendapat notifikasi balasan)
                </li>
              </ul>
            </SubSection>
          </Section>

          <Section title="2. Cara Kami Menggunakan Data">
            <p className="text-muted-foreground mb-3">
              Kami menggunakan data yang dikumpulkan untuk:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
              <li>Menyediakan dan menjalankan layanan {appName}</li>
              <li>Mengirim notifikasi email yang kamu aktifkan</li>
              <li>Mencegah spam dan penyalahgunaan layanan</li>
              <li>Meningkatkan kualitas dan keamanan platform</li>
              <li>Memproses pembayaran Premium (melalui Tripay)</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              Kami <strong>tidak</strong> menggunakan datamu untuk iklan, tidak
              menjual data ke pihak ketiga, dan tidak menggunakannya untuk
              tujuan di luar yang disebutkan di atas.
            </p>
          </Section>

          <Section title="3. Anonimitas Pengirim">
            <p className="text-muted-foreground">
              {appName} dirancang untuk menjaga anonimitas pengirim pesan. Kami
              tidak menyimpan, menampilkan, atau membagikan informasi identitas
              pengirim kepada pemilik profil atau pihak manapun. Hash IP yang
              kami simpan tidak dapat digunakan untuk melacak atau
              mengidentifikasi individu.
            </p>
          </Section>

          <Section title="4. Penyimpanan dan Keamanan Data">
            <p className="text-muted-foreground mb-3">
              Data disimpan di server yang berlokasi di Tencent Cloud dengan
              proteksi keamanan standar industri:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
              <li>Enkripsi data saat transit (HTTPS/TLS)</li>
              <li>Database yang terisolasi dan diproteksi</li>
              <li>Akses server terbatas dan termonitor</li>
            </ul>
          </Section>

          <Section title="5. Pihak Ketiga">
            <p className="text-muted-foreground mb-3">
              Kami menggunakan layanan pihak ketiga berikut:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
              <li>
                <strong>Clerk</strong> — autentikasi dan manajemen akun pengguna
              </li>
              <li>
                <strong>Resend</strong> — pengiriman notifikasi email
              </li>
              <li>
                <strong>Tripay</strong> — pemrosesan pembayaran Premium
              </li>
            </ul>
            <p className="text-muted-foreground mt-3">
              Masing-masing layanan ini memiliki kebijakan privasi tersendiri.
              Kami hanya berbagi data yang diperlukan untuk menjalankan fungsi
              tersebut.
            </p>
          </Section>

          <Section title="6. Cookie">
            <p className="text-muted-foreground">
              Kami menggunakan cookie yang diperlukan untuk menjaga sesi login
              dan preferensi tampilan. Kami tidak menggunakan cookie untuk
              pelacakan iklan atau analitik pihak ketiga.
            </p>
          </Section>

          <Section title="7. Hak-hak Kamu">
            <p className="text-muted-foreground mb-3">
              Sebagai pengguna, kamu berhak untuk:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
              <li>Mengakses dan mengunduh data akunmu</li>
              <li>Mengubah atau menghapus data profil kapan saja</li>
              <li>Menghapus akun beserta seluruh datanya</li>
              <li>Mencabut persetujuan penggunaan email kapan saja</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              Untuk mengajukan permintaan, hubungi kami di{" "}
              <a
                href="mailto:gosdorteam@gmail.com"
                className="text-primary hover:underline"
              >
                gosdorteam@gmail.com
              </a>
            </p>
          </Section>

          <Section title="8. Perubahan Kebijakan">
            <p className="text-muted-foreground">
              Kami dapat memperbarui kebijakan ini sewaktu-waktu. Perubahan
              signifikan akan diberitahukan melalui email atau notifikasi di
              dalam aplikasi. Tanggal pembaruan terakhir selalu tercantum di
              bagian atas halaman ini.
            </p>
          </Section>

          <Section title="9. Hubungi Kami">
            <p className="text-muted-foreground">
              Jika ada pertanyaan tentang kebijakan privasi ini, hubungi kami
              di:{" "}
              <a
                href="mailto:gosdorteam@gmail.com"
                className="text-primary hover:underline"
              >
                gosdorteam@gmail.com
              </a>
            </p>
          </Section>
        </div>
      </section>
    </StaticPageLayout>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-base font-bold text-foreground mb-3">{title}</h2>
      {children}
    </div>
  );
}

function SubSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <p className="text-sm font-medium text-foreground/80 mb-2">{title}</p>
      {children}
    </div>
  );
}
