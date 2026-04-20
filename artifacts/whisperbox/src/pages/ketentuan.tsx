import { StaticPageLayout } from "@/components/static-page-layout";
import { useSiteBranding } from "@/hooks/use-branding";

const LAST_UPDATED = "19 April 2026";

export default function KetentuanPage() {
  const { data: branding } = useSiteBranding();
  const appName = branding?.appName ?? "kepoin.me";

  return (
    <StaticPageLayout>
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-4xl mx-auto px-5 py-14">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            Syarat &amp; Ketentuan
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Syarat &amp; Ketentuan {appName}
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
              Dengan menggunakan layanan {appName} ("Layanan"), kamu menyetujui
              Syarat &amp; Ketentuan ini. Harap baca dengan seksama sebelum
              menggunakan Layanan.
            </p>
          </div>

          <Section title="1. Penerimaan Syarat">
            <p className="text-muted-foreground">
              Dengan mendaftar atau menggunakan {appName}, kamu menyatakan bahwa
              kamu berusia minimal 13 tahun dan menyetujui syarat-syarat ini.
              Jika kamu tidak setuju, harap tidak menggunakan Layanan.
            </p>
          </Section>

          <Section title="2. Penggunaan Layanan">
            <p className="text-muted-foreground mb-3">
              {appName} adalah platform pesan anonim untuk tujuan yang sah dan
              positif. Kamu boleh menggunakan Layanan untuk:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground mb-4">
              <li>Menerima pendapat jujur dan umpan balik dari orang lain</li>
              <li>Berbagi pertanyaan dan apresiasi secara anonim</li>
              <li>Interaksi sosial yang positif dan membangun</li>
            </ul>
          </Section>

          <Section title="3. Perilaku yang Dilarang">
            <p className="text-muted-foreground mb-3">
              Penggunaan berikut ini dilarang keras dan dapat menyebabkan
              pemblokiran akun:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
              <li>
                Mengirim pesan yang bersifat pelecehan, ancaman, atau intimidasi
              </li>
              <li>
                Konten yang mengandung kebencian berdasarkan ras, agama, gender,
                atau identitas lainnya
              </li>
              <li>Spam atau pengiriman pesan berulang secara berlebihan</li>
              <li>Konten pornografi, kekerasan eksplisit, atau ilegal</li>
              <li>
                Upaya untuk mengidentifikasi atau mengungkap identitas pengguna
                lain
              </li>
              <li>
                Menyalahgunakan platform untuk penipuan atau aktivitas kriminal
              </li>
              <li>Menggunakan bot atau otomasi untuk mengirim pesan massal</li>
            </ul>
          </Section>

          <Section title="4. Akun dan Tanggung Jawab">
            <p className="text-muted-foreground mb-3">
              Sebagai pemilik akun, kamu bertanggung jawab untuk:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
              <li>Menjaga kerahasiaan kredensial loginmu</li>
              <li>Semua aktivitas yang terjadi di bawah akunmu</li>
              <li>Segera melaporkan akses yang tidak sah ke akunmu</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              {appName} tidak bertanggung jawab atas kerugian akibat kegagalanmu
              menjaga keamanan akun.
            </p>
          </Section>

          <Section title="5. Konten Pengguna">
            <p className="text-muted-foreground">
              Kamu tetap memiliki hak atas konten yang kamu kirim atau tampilkan
              di {appName}. Dengan menggunakan Layanan, kamu memberi kami
              lisensi terbatas untuk menyimpan dan menampilkan konten tersebut
              sesuai fungsi platform. Kami berhak menghapus konten yang
              melanggar Syarat ini kapan saja.
            </p>
          </Section>

          <Section title="6. Privasi">
            <p className="text-muted-foreground">
              Penggunaan data pribadimu diatur dalam{" "}
              <a href="/privasi" className="text-primary hover:underline">
                Kebijakan Privasi
              </a>{" "}
              kami yang merupakan bagian tidak terpisahkan dari Syarat ini.
            </p>
          </Section>

          <Section title="7. Premium dan Pembayaran">
            <p className="text-muted-foreground mb-3">
              Paket Premium {appName} adalah pembelian sekali bayar (bukan
              langganan berulang). Ketentuan pembayaran:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
              <li>
                Harga dapat berubah sewaktu-waktu dengan pemberitahuan terlebih
                dahulu
              </li>
              <li>
                Pembayaran diproses melalui Tripay dan tidak dapat dikembalikan
                kecuali terdapat gangguan teknis dari pihak kami
              </li>
              <li>
                Fitur Premium berlaku seumur hidup akun selama layanan
                beroperasi
              </li>
            </ul>
          </Section>

          <Section title="8. Penghentian Layanan">
            <p className="text-muted-foreground">
              Kami berhak menangguhkan atau menghapus akun yang melanggar Syarat
              ini, dengan atau tanpa pemberitahuan sebelumnya tergantung tingkat
              pelanggaran. Kamu juga dapat menghapus akunmu kapan saja melalui
              pengaturan akun.
            </p>
          </Section>

          <Section title="9. Perubahan Layanan">
            <p className="text-muted-foreground">
              Kami berhak mengubah, menambah, atau menghentikan fitur Layanan
              kapan saja. Perubahan signifikan pada Syarat ini akan
              diberitahukan setidaknya 14 hari sebelum berlaku melalui email
              atau pengumuman di platform.
            </p>
          </Section>

          <Section title="10. Batasan Tanggung Jawab">
            <p className="text-muted-foreground">
              {appName} disediakan "sebagaimana adanya" tanpa jaminan
              ketersediaan 100%. Kami tidak bertanggung jawab atas kerugian
              tidak langsung yang timbul dari penggunaan atau ketidaktersediaan
              Layanan. Tanggung jawab kami terbatas pada jumlah yang telah kamu
              bayarkan (jika ada) dalam 3 bulan terakhir.
            </p>
          </Section>

          <Section title="11. Hukum yang Berlaku">
            <p className="text-muted-foreground">
              Syarat ini diatur oleh hukum Republik Indonesia. Setiap sengketa
              yang timbul diselesaikan melalui musyawarah mufakat. Jika tidak
              tercapai, sengketa diselesaikan melalui pengadilan yang berwenang
              di Indonesia.
            </p>
          </Section>

          <Section title="12. Hubungi Kami">
            <p className="text-muted-foreground">
              Pertanyaan tentang Syarat &amp; Ketentuan ini dapat disampaikan
              ke:{" "}
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
