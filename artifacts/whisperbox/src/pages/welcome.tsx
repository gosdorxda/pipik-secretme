import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useUser } from "@clerk/react";
import { MessageSquare, Crown, Gift, BarChart2, ArrowRight, Sparkles } from "lucide-react";
import { useGetMyProfile } from "@workspace/api-client-react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

const FEATURES = [
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: "Pesan Anonim",
    desc: "Terima pesan jujur dari siapa saja — teman, followers, atau orang asing — tanpa mereka perlu login.",
  },
  {
    icon: <Crown className="w-5 h-5" />,
    title: "Premium",
    desc: "Buka fitur eksklusif: social links, notifikasi email, dan lebih banyak lagi.",
  },
  {
    icon: <Gift className="w-5 h-5" />,
    title: "Referral & Poin",
    desc: "Ajak teman bergabung, kumpulkan poin, dan tukarkan dengan hadiah menarik.",
  },
  {
    icon: <BarChart2 className="w-5 h-5" />,
    title: "Wrapped Recap",
    desc: "Lihat ringkasan seru dari semua pesan yang kamu terima — kata-kata populer, waktu paling aktif, dan lainnya.",
  },
];

export default function WelcomePage() {
  const { user } = useUser();
  const [, setLocation] = useLocation();
  const { data: profile, isLoading } = useGetMyProfile();

  useEffect(() => {
    if (!isLoading && profile?.username) {
      setLocation("/dashboard");
    }
  }, [isLoading, profile, setLocation]);

  const firstName = user?.firstName || user?.username || "Kamu";

  if (isLoading) return null;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f9fafb" }}>
      {/* Hero */}
      <div
        className="relative overflow-hidden flex flex-col items-center justify-center px-6 py-16 text-center"
        style={{ background: "linear-gradient(135deg, #0f2e28 0%, #1a443c 60%, #215c52 100%)" }}
      >
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #86ead4, transparent)" }}
          />
          <div
            className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #86ead4, transparent)" }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center max-w-xl mx-auto">
          <img
            src={`${basePath}/logo.svg`}
            alt="WhisperBox"
            className="w-14 h-14 mb-5"
          />

          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-xs mb-5"
            style={{ background: "rgba(134,234,212,0.15)", color: "#86ead4" }}
          >
            <Sparkles className="w-3 h-3" />
            Akun berhasil dibuat!
          </span>

          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
            Selamat datang,<br />
            <span style={{ color: "#86ead4" }}>{firstName}!</span>
          </h1>

          <p className="text-[#a7f3e4] text-base leading-relaxed max-w-sm">
            WhisperBox adalah platform pesan anonim-mu. Buat profil, bagikan link, dan terima pesan jujur dari siapa saja.
          </p>
        </div>
      </div>

      {/* Feature cards */}
      <div className="flex-1 flex flex-col items-center px-6 py-10">
        <div className="w-full max-w-2xl">
          <p className="text-sm font-semibold text-center text-foreground/60 uppercase tracking-widest mb-6">
            Yang bisa kamu lakukan
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="flex gap-4 p-5 rounded-xs bg-white shadow-sm"
                style={{ border: "1px solid #e4e4e7" }}
              >
                <div
                  className="w-10 h-10 rounded-xs flex items-center justify-center shrink-0"
                  style={{ background: "rgba(134,234,212,0.15)", color: "#1a443c" }}
                >
                  {f.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">{f.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex justify-center">
            <Link href="/settings">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold rounded-xs transition-colors shadow-sm"
                style={{ background: "#86ead4", color: "#1a443c" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#7de0cb")}
                onMouseLeave={e => (e.currentTarget.style.background = "#86ead4")}
              >
                Atur Username &amp; Mulai
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Kamu butuh username untuk mulai menerima pesan.
          </p>
        </div>
      </div>
    </div>
  );
}
