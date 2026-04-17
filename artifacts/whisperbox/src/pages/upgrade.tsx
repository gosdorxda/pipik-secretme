import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useAppConfig } from "@/hooks/use-app-config";
import {
  Crown, Check, Loader2, QrCode, RefreshCw, Sparkles,
  Instagram, Bell, Image as ImageIcon, Copy, CheckCheck,
  AlertCircle, Shield, Zap, Link2, Mail, Star, Gift,
} from "lucide-react";
import {
  useCreatePayment,
  useGetPaymentStatus,
  useGetMyProfile,
  getGetMyProfileQueryKey,
  getGetPaymentStatusQueryKey,
} from "@workspace/api-client-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

function formatPrice(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}

const FREE_FEATURES = [
  { label: "Foto avatar profil", icon: <ImageIcon className="w-3.5 h-3.5" /> },
  { label: "Username & display name kustom", icon: <Star className="w-3.5 h-3.5" /> },
  { label: "Bio profil singkat", icon: <Check className="w-3.5 h-3.5" /> },
  { label: "Terima pesan anonim tak terbatas", icon: <Check className="w-3.5 h-3.5" /> },
  { label: "Balas pesan", icon: <Check className="w-3.5 h-3.5" /> },
  { label: "Share message card ke IG/Twitter", icon: <Check className="w-3.5 h-3.5" /> },
  { label: "Profil publik dengan link personal", icon: <Check className="w-3.5 h-3.5" /> },
  { label: "Statistik pesan dasar", icon: <Check className="w-3.5 h-3.5" /> },
];

const PREMIUM_FEATURES = [
  { label: "Semua fitur Free", icon: <Check className="w-3.5 h-3.5" />, highlight: false },
  { label: "Social links (Instagram, TikTok, X, GitHub, LinkedIn, Facebook, dll.)", icon: <Instagram className="w-3.5 h-3.5" />, highlight: true },
  { label: "Notifikasi email otomatis tiap pesan masuk", icon: <Mail className="w-3.5 h-3.5" />, highlight: true },
  { label: "Badge ✓ Premium eksklusif di profil publik", icon: <Crown className="w-3.5 h-3.5" />, highlight: true },
  { label: "Kampanye pesan: ajukan pertanyaan ke pengunjung profilmu", icon: <Zap className="w-3.5 h-3.5" />, highlight: false },
  { label: "Akses Wrapped: ringkasan pesan tahunanmu", icon: <Sparkles className="w-3.5 h-3.5" />, highlight: false },
  { label: "Poin referral bonus saat ajak teman upgrade", icon: <Gift className="w-3.5 h-3.5" />, highlight: false },
  { label: "Prioritas dukungan & fitur baru", icon: <Shield className="w-3.5 h-3.5" />, highlight: false },
];

const PAYMENT_METHODS = [
  { name: "BCA Mobile", color: "#003d82", abbr: "BCA" },
  { name: "Mandiri", color: "#003087", abbr: "MDR" },
  { name: "BNI", color: "#f47920", abbr: "BNI" },
  { name: "BRI", color: "#003d82", abbr: "BRI" },
  { name: "Danamon", color: "#e30613", abbr: "DAN" },
  { name: "CIMB Niaga", color: "#c41f1f", abbr: "CMB" },
  { name: "GoPay", color: "#00aed6", abbr: "GO" },
  { name: "OVO", color: "#4c3494", abbr: "OVO" },
  { name: "DANA", color: "#118ee8", abbr: "DANA" },
  { name: "ShopeePay", color: "#f2520c", abbr: "SPY" },
  { name: "LinkAja", color: "#e8192c", abbr: "LA" },
  { name: "Jenius", color: "#5fbeef", abbr: "JNS" },
];

const TRUST_POINTS = [
  { icon: "🔒", title: "Pembayaran Aman", desc: "Diproses oleh Tripay, payment gateway terpercaya di Indonesia" },
  { icon: "✅", title: "Bayar Sekali", desc: "Tidak ada biaya bulanan atau biaya tersembunyi. Lifetime access." },
  { icon: "⚡", title: "Aktif Instan", desc: "Premium langsung aktif setelah pembayaran dikonfirmasi" },
];

type PaymentStep = "plan" | "qr" | "success";

export default function UpgradePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<PaymentStep>("plan");
  const [merchantRef, setMerchantRef] = useState<string | null>(null);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [qrString, setQrString] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { data: configData } = useAppConfig();
  const premiumPrice = configData?.premiumPrice ?? 49900;

  const handleCopyQr = () => {
    if (!qrString) return;
    navigator.clipboard.writeText(qrString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const { data: profile } = useGetMyProfile();
  const createPayment = useCreatePayment();

  const { data: statusData, refetch: refetchStatus } = useGetPaymentStatus(
    merchantRef ?? "",
    {
      query: {
        enabled: !!merchantRef,
        queryKey: getGetPaymentStatusQueryKey(merchantRef ?? ""),
      },
    }
  );

  useEffect(() => {
    if (profile?.isPremium) {
      setStep("success");
    }
  }, [profile]);

  useEffect(() => {
    if (step !== "success") return;
    const timer = setTimeout(() => setLocation("/settings"), 2000);
    return () => clearTimeout(timer);
  }, [step, setLocation]);

  useEffect(() => {
    if (step === "qr" && merchantRef) {
      pollRef.current = setInterval(async () => {
        const result = await refetchStatus();
        if (result.data?.status === "PAID" || result.data?.isPremium) {
          clearInterval(pollRef.current!);
          await queryClient.invalidateQueries({ queryKey: getGetMyProfileQueryKey() });
          setStep("success");
        }
      }, 3000);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [step, merchantRef, refetchStatus, queryClient]);

  useEffect(() => {
    if (!expiresAt) return;
    const timer = setInterval(() => {
      const diff = expiresAt - Math.floor(Date.now() / 1000);
      if (diff <= 0) {
        setTimeLeft("expired");
        clearInterval(timer);
        if (pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
      } else {
        const h = Math.floor(diff / 3600);
        const m = Math.floor((diff % 3600) / 60);
        const s = diff % 60;
        setTimeLeft(
          h > 0
            ? `${h}j ${m.toString().padStart(2, "0")}m`
            : `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
        );
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  const handlePay = (isRenew = false) => {
    if (isRenew) {
      setQrImageUrl(null);
      setQrString(null);
      setExpiresAt(null);
      setTimeLeft("");
      setMerchantRef(null);
    }
    createPayment.mutate(
      undefined,
      {
        onSuccess: (data) => {
          setMerchantRef(data.merchantRef);
          setQrString(data.qrString);
          setQrImageUrl(data.qrImageUrl);
          setExpiresAt(data.expiresAt ?? null);
          setTimeLeft("");
          setStep("qr");
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.error;
          if (msg === "already_premium") {
            toast({ title: "Kamu sudah Premium!", description: "Akun kamu sudah aktif Premium." });
            setStep("success");
          } else {
            toast({
              title: "Gagal membuat transaksi",
              description: "Coba lagi dalam beberapa saat.",
              variant: "destructive",
            });
          }
        },
      }
    );
  };

  if (step === "success") {
    return (
      <AppLayout>
        <div className="max-w-md mx-auto py-12 flex flex-col items-center text-center gap-6">
          <div className="w-20 h-20 rounded-full bg-amber-100 border-2 border-amber-200 flex items-center justify-center">
            <Crown className="w-9 h-9 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Selamat! Kamu Premium 🎉</h1>
            <p className="text-muted-foreground text-sm">
              Semua fitur premium sudah aktif. Sekarang kamu bisa menambahkan social links,
              notifikasi email, dan lebih banyak lagi.
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              Mengarahkan ke Settings dalam 2 detik...
            </p>
          </div>
          <Button className="w-full sm:w-auto gap-2" onClick={() => setLocation("/settings")}>
            <Sparkles className="w-4 h-4" />
            Buka Settings Sekarang
          </Button>
        </div>
      </AppLayout>
    );
  }

  if (step === "qr") {
    return (
      <AppLayout>
        <div className="max-w-md mx-auto py-8 space-y-5">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary-foreground text-sm font-semibold px-4 py-1.5 rounded-md mb-3">
              <QrCode className="w-4 h-4" /> Bayar dengan QRIS
            </div>
            <h1 className="text-xl font-bold">Scan QR Code di bawah ini</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Gunakan aplikasi m-banking, GoPay, OVO, Dana, atau dompet digital lainnya
            </p>
          </div>

          {timeLeft === "expired" && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-md px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-700">QR Code sudah kadaluarsa</p>
                <p className="text-xs text-red-600 mt-0.5">Buat QR baru untuk melanjutkan pembayaran.</p>
              </div>
              <Button
                size="sm"
                onClick={() => handlePay(true)}
                disabled={createPayment.isPending}
                className="shrink-0 gap-1.5"
              >
                {createPayment.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                Buat QR Baru
              </Button>
            </div>
          )}

          <div className="border border-border bg-white rounded-md p-6 flex flex-col items-center gap-4 shadow-sm">
            {/* QRIS info bar */}
            <div className="w-full flex items-center justify-between px-2 pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#e30613] flex items-center justify-center">
                  <span className="text-white text-[9px] font-black">QRIS</span>
                </div>
                <span className="text-xs font-semibold text-foreground">Pembayaran Universal</span>
              </div>
              <span className="text-[13px] text-muted-foreground">by Tripay</span>
            </div>

            <div className="w-56 h-56 flex items-center justify-center rounded-md border border-border overflow-hidden bg-secondary/20 relative">
              {qrImageUrl ? (
                <>
                  <img
                    src={qrImageUrl}
                    alt="QRIS Code"
                    className={`w-full h-full object-contain transition-opacity ${timeLeft === "expired" ? "opacity-30" : ""}`}
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                  {timeLeft === "expired" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                      <AlertCircle className="w-8 h-8 text-red-400" />
                      <span className="text-xs font-semibold text-red-500">Kadaluarsa</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImageIcon className="w-8 h-8" />
                  <span className="text-xs">Memuat QR...</span>
                </div>
              )}
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{formatPrice(premiumPrice)}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Pembayaran sekali, premium selamanya</p>
            </div>

            {timeLeft && timeLeft !== "expired" && (
              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                QR berlaku selama: <span className="font-mono font-semibold text-foreground">{timeLeft}</span>
              </div>
            )}

            {qrString && timeLeft !== "expired" && (
              <div className="w-full">
                <p className="text-[13px] text-muted-foreground mb-1.5 text-center">Data QR (untuk dompet digital yang mendukung paste)</p>
                <div className="flex items-center gap-2 bg-secondary/50 border border-border rounded-md px-3 py-2">
                  <p className="text-[13px] font-mono text-muted-foreground truncate flex-1 select-all">
                    {qrString}
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyQr}
                    className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                    title="Copy QR data"
                  >
                    {copied
                      ? <CheckCheck className="w-3.5 h-3.5 text-primary" />
                      : <Copy className="w-3.5 h-3.5" />
                    }
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Supported apps */}
          <div className="border border-border rounded-md p-4">
            <p className="text-xs font-semibold text-foreground mb-3">Diterima oleh semua aplikasi QRIS:</p>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_METHODS.map((m) => (
                <div
                  key={m.name}
                  className="flex items-center gap-1.5 px-2.5 py-1 border border-border bg-white"
                  title={m.name}
                >
                  <div className="w-4 h-4 flex items-center justify-center shrink-0"
                       style={{ background: m.color }}>
                    <span className="text-white font-black" style={{ fontSize: 5 }}>{m.abbr.charAt(0)}</span>
                  </div>
                  <span className="text-[13px] font-medium text-foreground">{m.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-secondary/40 border border-border rounded-md p-4 space-y-2">
            <p className="text-xs font-semibold text-foreground">Cara pembayaran:</p>
            <ol className="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside">
              <li>Buka aplikasi m-banking atau dompet digital kamu</li>
              <li>Pilih menu Scan QR / QRIS</li>
              <li>Arahkan kamera ke QR code di atas</li>
              <li>Konfirmasi pembayaran sebesar <strong className="text-foreground">{formatPrice(premiumPrice)}</strong></li>
              <li>Halaman ini otomatis update setelah pembayaran berhasil</li>
            </ol>
          </div>

          <div className="flex gap-3">
            {timeLeft !== "expired" && (
              <Button
                variant="outline"
                className="flex-1 gap-2 text-sm"
                onClick={() => refetchStatus()}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Cek Status
              </Button>
            )}
            <Button
              variant="ghost"
              className="flex-1 text-sm text-muted-foreground"
              onClick={() => {
                if (pollRef.current) clearInterval(pollRef.current);
                setStep("plan");
              }}
            >
              Batal
            </Button>
          </div>

          {timeLeft !== "expired" && (
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Menunggu konfirmasi pembayaran...
            </div>
          )}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            <Crown className="w-3.5 h-3.5" /> Premium Lifetime
          </div>
          <h1 className="text-3xl font-bold mb-2">Upgrade ke WhisperBox Premium</h1>
          <p className="text-muted-foreground max-w-sm mx-auto text-sm leading-relaxed">
            Bayar sekali, nikmati selamanya. Buka semua fitur dan buat profilmu lebih menarik dan profesional.
          </p>
        </div>

        {/* Pricing grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Free */}
          <div className="border border-border rounded-md p-5 bg-white">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Free</p>
            <p className="text-3xl font-bold mb-1">Gratis</p>
            <p className="text-xs text-muted-foreground mb-5">Selamanya tanpa biaya</p>
            <ul className="space-y-2.5">
              {FREE_FEATURES.map((f) => (
                <li key={f.label} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <span className="mt-0.5 shrink-0 text-muted-foreground/60">{f.icon}</span>
                  {f.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Premium */}
          <div className="border-2 border-primary rounded-md p-5 bg-primary/5 relative overflow-hidden">
            <div className="absolute top-3 right-3">
              <span className="bg-amber-500 text-white text-[13px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                Terbaik
              </span>
            </div>
            <p className="text-xs font-semibold text-primary-foreground uppercase tracking-wider mb-1">Premium</p>
            <div className="flex items-baseline gap-1 mb-1">
              <p className="text-3xl font-bold">{formatPrice(premiumPrice)}</p>
            </div>
            <p className="text-xs text-muted-foreground mb-5">sekali bayar &middot; aktif selamanya</p>
            <ul className="space-y-2.5">
              {PREMIUM_FEATURES.map((f) => (
                <li key={f.label} className="flex items-start gap-2.5 text-sm">
                  <span className={`mt-0.5 shrink-0 ${f.highlight ? "text-primary-foreground" : "text-primary"}`}>{f.icon}</span>
                  <span className={f.highlight ? "font-semibold text-foreground" : "text-foreground"}>{f.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment methods */}
        <div className="border border-border rounded-md p-5 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-[#e30613] flex items-center justify-center">
              <span className="text-white text-[8px] font-black">QRIS</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Diterima oleh semua aplikasi QRIS Indonesia</p>
              <p className="text-xs text-muted-foreground">Bayar dari m-banking atau dompet digital mana saja</p>
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {PAYMENT_METHODS.map((m) => (
              <div
                key={m.name}
                className="flex items-center gap-2 px-3 py-2 border border-border bg-secondary/30 hover:border-border/80 transition-colors"
              >
                <div
                  className="w-5 h-5 flex items-center justify-center shrink-0 text-white"
                  style={{ background: m.color, fontSize: 7, fontWeight: 900 }}
                >
                  {m.abbr.slice(0, 2)}
                </div>
                <span className="text-xs font-medium text-foreground truncate">{m.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust points */}
        <div className="grid sm:grid-cols-3 gap-3">
          {TRUST_POINTS.map((t) => (
            <div key={t.title} className="flex gap-3 p-4 border border-border rounded-md bg-white">
              <span className="text-xl shrink-0 leading-none mt-0.5">{t.icon}</span>
              <div>
                <p className="text-sm font-semibold text-foreground">{t.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3 pb-4">
          <Button
            size="lg"
            className="w-full sm:w-auto gap-2 px-10 text-base font-semibold"
            onClick={() => handlePay()}
            disabled={createPayment.isPending}
          >
            {createPayment.isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Membuat transaksi...</>
            ) : (
              <><QrCode className="w-4 h-4" /> Bayar dengan QRIS &mdash; {formatPrice(premiumPrice)}</>
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center max-w-xs leading-relaxed">
            Pembayaran diproses secara aman oleh <strong>Tripay</strong>. QR code berlaku 24 jam setelah dibuat. Tidak ada tagihan rutin.
          </p>
        </div>

      </div>
    </AppLayout>
  );
}