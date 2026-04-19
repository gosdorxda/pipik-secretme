import { useState } from "react";
import { useAppConfig } from "@/hooks/use-app-config";
import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Copy,
  Check,
  Users,
  Link2,
  Star,
  Trophy,
  Gift,
  UserPlus,
  Crown,
  Send,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  useGetMyReferralStats,
  useGetMyProfile,
  useGetMyRedeemRequests,
  useCreateRedeemRequest,
  getGetMyRedeemRequestsQueryKey,
  getGetMyReferralStatsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const BASE_URL = typeof window !== "undefined" ? window.location.origin : "";

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

const STATUS_LABEL: Record<
  string,
  { label: string; cls: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Diproses",
    cls: "bg-amber-100 text-amber-700 border-amber-200",
    icon: <Clock className="w-3 h-3" />,
  },
  success: {
    label: "Sukses",
    cls: "bg-green-100 text-green-700 border-green-200",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  rejected: {
    label: "Ditolak",
    cls: "bg-red-100 text-red-700 border-red-200",
    icon: <Trophy className="w-3 h-3" />,
  },
};

export default function ReferralPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [redeemPoints, setRedeemPoints] = useState("");
  const [paymentInfo, setPaymentInfo] = useState("");
  const { data: appConfig } = useAppConfig();
  const redeemRate = appConfig?.redeemRate ?? 10000;
  const referralSignupPoints = appConfig?.referralSignupPoints ?? 10;
  const referralUpgradePoints = appConfig?.referralUpgradePoints ?? 100;
  const linkOpensPointsPer1000 = appConfig?.linkOpensPointsPer1000 ?? 1;

  const { data: referral, isLoading } = useGetMyReferralStats();
  const { data: profile } = useGetMyProfile();
  const { data: redeemData, isLoading: loadingRequests } =
    useGetMyRedeemRequests();
  const redeemRequests = redeemData?.requests ?? [];
  const createRedeem = useCreateRedeemRequest();

  const referralLink = referral?.referralCode
    ? `${BASE_URL}/?ref=${referral.referralCode}`
    : "";

  const copyLink = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      title: "Link referral disalin!",
      description: "Bagikan ke teman-temanmu sekarang.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const totalPoints = referral?.totalPoints ?? 0;
  const availablePoints = referral?.availablePoints ?? totalPoints;
  const parsedPoints = parseInt(redeemPoints, 10);
  const canSubmit =
    !isNaN(parsedPoints) &&
    parsedPoints >= 1000 &&
    parsedPoints <= availablePoints &&
    paymentInfo.trim().length > 0;
  const estimatedValue =
    !isNaN(parsedPoints) && parsedPoints >= 1000
      ? Math.floor(parsedPoints / 1000) * redeemRate
      : 0;

  const handleRedeem = () => {
    if (!canSubmit) return;
    createRedeem.mutate(
      { data: { points: parsedPoints, paymentInfo: paymentInfo.trim() } },
      {
        onSuccess: () => {
          toast({
            title: "Permintaan dikirim!",
            description: "Admin akan memproses penukaran poinmu.",
          });
          setRedeemPoints("");
          setPaymentInfo("");
          queryClient.invalidateQueries({
            queryKey: getGetMyRedeemRequestsQueryKey(),
          });
          queryClient.invalidateQueries({
            queryKey: getGetMyReferralStatsQueryKey(),
          });
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.error ?? "Terjadi kesalahan.";
          toast({ title: "Gagal", description: msg, variant: "destructive" });
        },
      },
    );
  };

  return (
    <AppLayout>
      <div className="space-y-5">
        {/* ── Hero Points Card ── */}
        <div
          className="relative overflow-hidden rounded-md px-7 py-8 text-center"
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #0c2318 100%)",
            border: "1px solid #86ead430",
          }}
        >
          <style>{`
            @keyframes wb-float-a { 0%,100% { transform: translate(-50%,-50%) scale(1);   opacity: 0.18; }
                                    50%      { transform: translate(-50%,-50%) scale(1.25); opacity: 0.28; } }
            @keyframes wb-float-b { 0%,100% { transform: translate(-50%,-50%) scale(1.1); opacity: 0.12; }
                                    50%      { transform: translate(-50%,-50%) scale(0.85); opacity: 0.22; } }
            @keyframes wb-float-c { 0%,100% { transform: translate(-50%,-50%); opacity: 0.08; }
                                    50%      { transform: translate(-50%,-50%) scale(1.4);  opacity: 0.15; } }
            @keyframes wb-pulse-ring { 0%,100% { transform: translate(-50%,-50%) scale(0.95); opacity: 0.10; }
                                       50%      { transform: translate(-50%,-50%) scale(1.05); opacity: 0.20; } }
          `}</style>
          <div className="absolute inset-0 pointer-events-none">
            {/* main glow */}
            <div
              className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full"
              style={{
                background: "radial-gradient(circle, #86ead4, transparent)",
                animation: "wb-float-a 6s ease-in-out infinite",
              }}
            />
            {/* secondary glow bottom-right */}
            <div
              className="absolute top-3/4 left-3/4 w-40 h-40 rounded-full"
              style={{
                background: "radial-gradient(circle, #7c3aed50, transparent)",
                animation: "wb-float-b 8s ease-in-out infinite",
              }}
            />
            {/* tertiary glow top-left */}
            <div
              className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full"
              style={{
                background: "radial-gradient(circle, #38bdf840, transparent)",
                animation: "wb-float-c 10s ease-in-out infinite",
              }}
            />
            {/* pulsing ring */}
            <div
              className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full"
              style={{
                border: "1px solid rgba(134,234,212,0.15)",
                animation: "wb-pulse-ring 5s ease-in-out infinite",
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full"
              style={{
                border: "1px solid rgba(134,234,212,0.07)",
                animation: "wb-pulse-ring 7s ease-in-out infinite reverse",
              }}
            />
            {/* sparkle dots */}
            <div
              className="absolute w-1 h-1 rounded-full"
              style={{
                top: "20%",
                left: "15%",
                background: "#86ead4",
                opacity: 0.4,
              }}
            />
            <div
              className="absolute w-1 h-1 rounded-full"
              style={{
                top: "70%",
                left: "85%",
                background: "#86ead4",
                opacity: 0.3,
              }}
            />
            <div
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                top: "30%",
                left: "78%",
                background: "#c4b5fd",
                opacity: 0.4,
              }}
            />
            <div
              className="absolute w-1 h-1 rounded-full"
              style={{
                top: "80%",
                left: "20%",
                background: "#7dd3fc",
                opacity: 0.35,
              }}
            />
          </div>
          <div className="relative">
            <div className="flex items-center justify-center mb-4">
              <span
                className="text-sm font-bold tracking-wider uppercase"
                style={{ color: "#86ead4" }}
              >
                Poin Kamu
              </span>
            </div>
            {isLoading ? (
              <Skeleton className="h-16 w-32 mx-auto mb-2 bg-white/10" />
            ) : (
              <div className="text-7xl font-black text-white mb-1 leading-none">
                {availablePoints}
              </div>
            )}
            <p className="text-sm" style={{ color: "#94a3b8" }}>
              poin tersedia
              {!isLoading && totalPoints !== availablePoints && (
                <span className="ml-2 text-xs opacity-60">
                  (total terkumpul: {totalPoints})
                </span>
              )}
            </p>

            {!isLoading && (
              <div
                className="flex items-center justify-center gap-5 mt-6 pt-5 flex-wrap"
                style={{ borderTop: "1px solid rgba(134,234,212,0.15)" }}
              >
                <div className="text-center">
                  <div className="text-xl font-bold text-white">
                    +{referral?.points ?? 0}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                    dari referral
                  </div>
                </div>
                <div
                  className="w-px h-8 shrink-0"
                  style={{ background: "rgba(134,234,212,0.2)" }}
                />
                <div className="text-center">
                  <div className="text-xl font-bold text-white">
                    +{referral?.pointsFromLinkOpens ?? 0}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                    dari link dibuka
                  </div>
                </div>
                <div
                  className="w-px h-8 shrink-0"
                  style={{ background: "rgba(134,234,212,0.2)" }}
                />
                <div className="text-center">
                  <div className="text-xl font-bold text-white">
                    {referral?.referralCount ?? 0}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                    teman diundang
                  </div>
                </div>
                {(referral?.redeemedPoints ?? 0) > 0 && (
                  <>
                    <div
                      className="w-px h-8 shrink-0"
                      style={{ background: "rgba(134,234,212,0.2)" }}
                    />
                    <div className="text-center">
                      <div
                        className="text-xl font-bold"
                        style={{ color: "#f87171" }}
                      >
                        -{referral?.redeemedPoints ?? 0}
                      </div>
                      <div
                        className="text-xs mt-0.5"
                        style={{ color: "#64748b" }}
                      >
                        sudah ditukar
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Ticker Marquee ── */}
        {(() => {
          const TICKER_ITEMS = [
            { name: "Rani S.", points: 2500, icon: "🎁" },
            { name: "Budi A.", points: 1000, icon: "⭐" },
            { name: "Dewi K.", points: 5000, icon: "👑" },
            { name: "Fajar M.", points: 1500, icon: "🎁" },
            { name: "Siti R.", points: 3000, icon: "⭐" },
            { name: "Hendra W.", points: 1000, icon: "🎁" },
            { name: "Maya P.", points: 2000, icon: "👑" },
            { name: "Rizky D.", points: 7500, icon: "⭐" },
          ];
          const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
          return (
            <div
              className="relative overflow-hidden rounded-md"
              style={{
                background: "rgba(15,23,42,0.75)",
                border: "1px solid rgba(134,234,212,0.14)",
              }}
            >
              <style>{`
                @keyframes wb-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
              `}</style>
              <div className="py-2.5 flex items-center overflow-hidden">
                <div
                  className="flex items-center gap-0 whitespace-nowrap"
                  style={{
                    animation: "wb-marquee 30s linear infinite",
                    willChange: "transform",
                  }}
                >
                  {items.map((item, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-2 px-5"
                    >
                      <span className="text-sm leading-none">{item.icon}</span>
                      <span
                        className="text-xs font-medium"
                        style={{ color: "#94a3b8" }}
                      >
                        <span
                          className="font-bold"
                          style={{ color: "#e2e8f0" }}
                        >
                          {item.name}
                        </span>{" "}
                        menukar{" "}
                        <span
                          className="font-bold"
                          style={{ color: "#86ead4" }}
                        >
                          {item.points.toLocaleString("id-ID")} poin
                        </span>
                      </span>
                      <span className="w-px h-3 bg-white/10 mx-1" />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── Referral Link Card ── */}
        <div className="bg-white border border-border rounded-md overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-primary/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-primary/15 flex items-center justify-center">
              <Link2 className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">Link Referralmu</p>
              <p className="text-xs text-muted-foreground">
                Bagikan ke teman agar mereka daftar lewat linkmu
              </p>
            </div>
          </div>
          <div className="px-5 py-4">
            {isLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-secondary border border-border rounded-md px-3 py-2.5 text-xs font-mono text-foreground/80 truncate">
                  {referralLink || "Memuat..."}
                </div>
                <Button onClick={copyLink} size="sm" className="shrink-0 gap-2">
                  {copied ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copied ? "Tersalin!" : "Salin"}
                </Button>
              </div>
            )}
            <p className="text-[11px] text-muted-foreground mt-2.5 leading-relaxed">
              Kode referral:{" "}
              <span className="font-mono font-bold text-foreground">
                {isLoading ? "..." : (referral?.referralCode ?? "-")}
              </span>
            </p>
          </div>
        </div>

        {/* ── Cara Mendapatkan Poin ── */}
        <div className="bg-white border border-border rounded-md overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border bg-secondary/30">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Cara Mendapatkan Poin
            </p>
          </div>
          <div className="divide-y divide-border">
            <div className="px-5 py-4 flex items-center gap-4">
              <div className="w-11 h-11 rounded-md bg-emerald-100 flex items-center justify-center shrink-0">
                <UserPlus className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold mb-0.5">Undang Teman</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Bagikan link referralmu. Setiap orang yang daftar menggunakan
                  linkmu akan memberimu poin.
                </p>
              </div>
              <div className="shrink-0 text-right">
                <div
                  className="text-2xl font-black"
                  style={{ color: "#86ead4" }}
                >
                  +{referralSignupPoints}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  per referral
                </div>
              </div>
            </div>
            <div className="px-5 py-4 flex items-center gap-4">
              <div className="w-11 h-11 rounded-md bg-amber-100 flex items-center justify-center shrink-0">
                <Crown className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold mb-0.5">
                  Teman yang Diundang Upgrade Premium
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Bonus ekstra ketika teman yang kamu undang memutuskan untuk
                  upgrade ke akun Premium.
                </p>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-2xl font-black text-amber-600">
                  +{referralUpgradePoints}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  per upgrade
                </div>
              </div>
            </div>
            <div className="px-5 py-4 flex items-center gap-4">
              <div className="w-11 h-11 rounded-md bg-sky-100 flex items-center justify-center shrink-0">
                <Link2 className="w-5 h-5 text-sky-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold mb-0.5">
                  Link Profil Dibuka
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Semakin banyak orang membuka link profilmu, semakin banyak
                  poin yang kamu kumpulkan.
                </p>
              </div>
              <div className="shrink-0 text-right">
                <div
                  className="text-2xl font-black"
                  style={{ color: "#86ead4" }}
                >
                  +{linkOpensPointsPer1000}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  per 1.000 buka
                </div>
              </div>
            </div>
          </div>

          {!isLoading && (
            <div className="px-5 py-3.5 border-t border-border bg-secondary/20">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">
                  Link dibuka:{" "}
                  <span className="font-semibold text-foreground">
                    {referral?.linkOpens ?? 0}
                  </span>
                </span>
                <span className="text-xs text-muted-foreground">
                  {1000 - ((referral?.linkOpens ?? 0) % 1000)} lagi ke poin
                  berikutnya
                </span>
              </div>
              <div className="h-1.5 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, ((referral?.linkOpens ?? 0) % 1000) / 10)}%`,
                    background: "linear-gradient(90deg, #86ead4, #5cb8a0)",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Riwayat Referral ── */}
        <div className="bg-white border border-border rounded-md overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                <Users className="w-3.5 h-3.5 text-primary" />
              </div>
              <p className="text-sm font-semibold">Teman yang Diundang</p>
            </div>
            {!isLoading && (
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                {referral?.referralCount ?? 0} orang
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="px-5 py-4 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-9 h-9 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-12 rounded-md" />
                </div>
              ))}
            </div>
          ) : referral?.referrals && referral.referrals.length > 0 ? (
            <div className="divide-y divide-border">
              {referral.referrals.map((r: any, i: number) => (
                <div key={i} className="px-5 py-3.5 flex items-center gap-3">
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                      {(r.displayName ?? r.username).charAt(0).toUpperCase()}
                    </div>
                    {r.isPremium && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center border-2 border-white">
                        <Crown className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-none">
                      {r.displayName ?? `@${r.username}`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      @{r.username} · bergabung{" "}
                      {formatDistanceToNow(new Date(r.joinedAt), {
                        addSuffix: true,
                        locale: idLocale,
                      })}
                    </p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md">
                      <Star className="w-2.5 h-2.5" /> +{r.points}
                    </span>
                    {r.upgradeBonusAwarded && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-md">
                        <Crown className="w-2.5 h-2.5" /> +100
                      </span>
                    )}
                    {r.isPremium && !r.upgradeBonusAwarded && (
                      <span className="text-[10px] text-muted-foreground">
                        +100 segera
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-5 py-10 text-center">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
                <Gift className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-semibold mb-1">
                Belum ada teman yang diundang
              </p>
              <p className="text-xs text-muted-foreground mb-4 max-w-xs mx-auto">
                Salin link referralmu di atas dan bagikan ke teman-temanmu.
                Dapatkan 10 poin untuk setiap pendaftar baru!
              </p>
              <Button size="sm" className="gap-2" onClick={copyLink}>
                <Copy className="w-3.5 h-3.5" />
                Salin Link Sekarang
              </Button>
            </div>
          )}
        </div>

        {/* ── Penukaran Poin ── */}
        <div className="bg-white border border-border rounded-md overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-amber-50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-amber-100 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Penukaran Poin</p>
              <p className="text-xs text-muted-foreground">
                Tukar poinmu menjadi saldo/uang tunai
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">
                Rate saat ini
              </p>
              <p className="text-sm font-black text-amber-700">
                {formatRupiah(redeemRate)}{" "}
                <span className="font-normal text-xs text-muted-foreground">
                  / 1.000 poin
                </span>
              </p>
            </div>
          </div>
          <div className="px-5 py-5 space-y-4">
            {availablePoints < 1000 ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
                  <Star className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-semibold mb-1">Poin belum cukup</p>
                <p className="text-xs text-muted-foreground">
                  Kamu butuh minimal{" "}
                  <span className="font-bold text-foreground">1.000 poin</span>{" "}
                  untuk melakukan penukaran. Poin tersedia:{" "}
                  <span className="font-bold text-foreground">
                    {availablePoints} poin
                  </span>
                  .
                </p>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-sm font-medium block mb-1.5">
                    Jumlah Poin yang Ditukar
                  </label>
                  <input
                    type="number"
                    min={1000}
                    max={totalPoints}
                    step={100}
                    value={redeemPoints}
                    onChange={(e) => setRedeemPoints(e.target.value)}
                    placeholder="min. 1.000 poin"
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-xs text-muted-foreground">
                      Tersedia:{" "}
                      <span className="font-semibold text-foreground">
                        {availablePoints} poin
                      </span>
                    </p>
                    {estimatedValue > 0 && (
                      <p className="text-xs font-bold text-amber-700">
                        ≈ {formatRupiah(estimatedValue)}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1.5">
                    Info Pembayaran
                  </label>
                  <textarea
                    rows={2}
                    value={paymentInfo}
                    onChange={(e) => setPaymentInfo(e.target.value)}
                    placeholder="Contoh: DANA 08123456789 a.n. Budi Santoso"
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Tulis metode pembayaran, nomor rekening/dompet, dan nama
                    pemilik.
                  </p>
                </div>
                <Button
                  onClick={handleRedeem}
                  disabled={!canSubmit || createRedeem.isPending}
                  className="gap-2"
                >
                  {createRedeem.isPending ? (
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {createRedeem.isPending ? "Mengirim..." : "Ajukan Penukaran"}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* ── Riwayat Penukaran ── */}
        {(loadingRequests || redeemRequests.length > 0) && (
          <div className="bg-white border border-border rounded-md overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-amber-100 flex items-center justify-center">
                <Trophy className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <p className="text-sm font-semibold">Riwayat Penukaran</p>
            </div>
            {loadingRequests ? (
              <div className="px-5 py-4 space-y-3">
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : (
              <div className="divide-y divide-border">
                {redeemRequests.map((r: any) => {
                  const s = STATUS_LABEL[r.status] ?? STATUS_LABEL.pending;
                  return (
                    <div
                      key={r.id}
                      className="px-5 py-3.5 flex items-center gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="text-sm font-bold">
                            {r.points.toLocaleString("id-ID")} poin
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ·
                          </span>
                          <span className="text-xs text-amber-700 font-semibold">
                            {formatRupiah(
                              Math.floor(r.points / 1000) * redeemRate,
                            )}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {r.paymentInfo}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {formatDistanceToNow(new Date(r.createdAt), {
                            addSuffix: true,
                            locale: idLocale,
                          })}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md border ${s.cls}`}
                      >
                        {s.icon} {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
