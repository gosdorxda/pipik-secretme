import { useState, useEffect } from "react";
import { BannerAd } from "@/components/banner-ad";
import confetti from "canvas-confetti";
import { Link } from "wouter";
import { AppLayout } from "@/components/layout";
import { LazyAvatar } from "@/components/lazy-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { ShareMessageCard } from "@/components/share-message-card";
import { QRProfileCard } from "@/components/qr-profile-card";
import {
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Inbox,
  MessageSquare,
  Eye,
  CornerDownRight,
  Crown,
  Link2,
  Send,
  User,
  Globe,
  Lock,
  Share,
  Sparkles,
  Megaphone,
  Plus,
  X,
  Radio,
  ChevronDown,
  Download,
  Star,
  Search,
  CornerUpLeft,
  HelpCircle,
  MessageCircle,
  Flame,
  Zap,
  Heart,
  Mail,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";

import {
  useGetMyProfile,
  useGetMyMessages,
  useGetMyStats,
  useGetMyReferralStats,
  useDeleteMessage,
  useReplyToMessage,
  useUpdateMyProfile,
  useGetMyCampaign,
  useCreateCampaign,
  useEndCampaign,
  useCheckUsername,
  getGetMyMessagesQueryKey,
  getGetMyStatsQueryKey,
  getGetMyProfileQueryKey,
  getGetMyCampaignQueryKey,
} from "@workspace/api-client-react";
import { resolveAvatarUrl } from "@/lib/avatar";
import { useQueryClient } from "@tanstack/react-query";
import { useSiteBranding } from "@/hooks/use-branding";

const CAMPAIGN_COLORS = [
  {
    id: "teal",
    label: "Teal",
    swatch: "#14b8a6",
    gradient: "linear-gradient(135deg, #0d9488 0%, #14b8a6 60%, #2dd4bf 100%)",
  },
  {
    id: "violet",
    label: "Violet",
    swatch: "#8b5cf6",
    gradient: "linear-gradient(135deg, #6d28d9 0%, #7c3aed 50%, #8b5cf6 100%)",
  },
  {
    id: "sky",
    label: "Biru",
    swatch: "#0ea5e9",
    gradient: "linear-gradient(135deg, #0369a1 0%, #0ea5e9 60%, #38bdf8 100%)",
  },
  {
    id: "amber",
    label: "Amber",
    swatch: "#d97706",
    gradient: "linear-gradient(135deg, #b45309 0%, #d97706 50%, #fbbf24 100%)",
  },
  {
    id: "rose",
    label: "Rose",
    swatch: "#f43f5e",
    gradient: "linear-gradient(135deg, #be123c 0%, #e11d48 50%, #fb7185 100%)",
  },
];

const CAMPAIGN_ICONS = [
  { id: "megaphone", icon: Megaphone, label: "Megafon" },
  { id: "help-circle", icon: HelpCircle, label: "Tanya" },
  { id: "message-circle", icon: MessageCircle, label: "Chat" },
  { id: "flame", icon: Flame, label: "Api" },
  { id: "star", icon: Star, label: "Bintang" },
  { id: "zap", icon: Zap, label: "Kilat" },
  { id: "heart", icon: Heart, label: "Hati" },
  { id: "sparkles", icon: Sparkles, label: "Kilau" },
];

function maskEmail(email: string): string {
  const atIdx = email.indexOf("@");
  if (atIdx < 0) return "xxxxx";
  const domain = email.slice(atIdx + 1);
  return `xxxxx@${domain}`;
}

type StatAccent = "mint" | "blue" | "orange" | "amber";

const ACCENT_ICON: Record<StatAccent, { iconWrap: string; iconColor: string }> =
  {
    mint: { iconWrap: "bg-primary/15", iconColor: "text-primary" },
    blue: { iconWrap: "bg-sky-100", iconColor: "text-sky-600" },
    orange: { iconWrap: "bg-orange-100", iconColor: "text-orange-600" },
    amber: { iconWrap: "bg-amber-100", iconColor: "text-amber-600" },
  };

function StatCard({
  icon,
  label,
  value,
  accent = "mint",
  loading,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  accent?: StatAccent;
  loading?: boolean;
}) {
  const s = ACCENT_ICON[accent];
  return (
    <div className="bg-white border border-border rounded-md px-4 py-3 flex items-center gap-3">
      <div
        className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${s.iconWrap}`}
      >
        <span className={s.iconColor}>{icon}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground leading-none mb-1">
          {label}
        </p>
        <p className="text-xl font-bold leading-none text-foreground">
          {loading ? (
            <span className="text-muted-foreground/40">—</span>
          ) : (
            value
          )}
        </p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: branding } = useSiteBranding();
  const appName = branding?.appName ?? "kepoin.me";
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sharingMessage, setSharingMessage] = useState<{
    id: string;
    idx: number;
  } | null>(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "unread" | "unreplied" | "public"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [onboardingUsername, setOnboardingUsername] = useState("");
  const [onboardingDisplayName, setOnboardingDisplayName] = useState("");
  const [debouncedUsername, setDebouncedUsername] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsername(onboardingUsername.trim());
    }, 600);
    return () => clearTimeout(timer);
  }, [onboardingUsername]);

  useEffect(() => {
    if (!showConfetti) return;
    confetti({
      particleCount: 180,
      spread: 120,
      startVelocity: 45,
      decay: 0.92,
      origin: { x: 0.5, y: 0.6 },
      colors: [
        "#6366f1",
        "#8b5cf6",
        "#ec4899",
        "#f59e0b",
        "#10b981",
        "#38bdf8",
      ],
    });
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [showConfetti]);

  useEffect(() => {
    setVisibleCount(5);
  }, [activeFilter, searchQuery]);
  const [campaignTitle, setCampaignTitle] = useState("");
  const [campaignQuestion, setCampaignQuestion] = useState("");
  const [campaignColor, setCampaignColor] = useState("teal");
  const [campaignIcon, setCampaignIcon] = useState("megaphone");
  const [campaignOpen, setCampaignOpen] = useState(false);
  const [showQRCard, setShowQRCard] = useState(false);

  const { data: profile, isLoading: profileLoading } = useGetMyProfile();
  const { data: stats, isLoading: statsLoading } = useGetMyStats();
  const { data: referralStats } = useGetMyReferralStats();
  const { data: messagesData, isLoading: messagesLoading } = useGetMyMessages({
    limit: 50,
  });
  const { data: campaign, isLoading: campaignLoading } = useGetMyCampaign();
  const deleteMessage = useDeleteMessage();
  const replyToMessage = useReplyToMessage();
  const updateProfile = useUpdateMyProfile();
  const createCampaign = useCreateCampaign();
  const endCampaign = useEndCampaign();
  const { data: usernameCheck, isFetching: checkingUsername } =
    useCheckUsername(
      { username: debouncedUsername },
      { query: { enabled: debouncedUsername.length >= 3 } as any },
    );

  const publicUrl = profile?.username
    ? `${window.location.origin}/@${profile.username}`
    : "";

  const copyLink = () => {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast({
      title: "Link disalin!",
      description: "Link profil publikmu siap dibagikan.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = (id: string) => {
    deleteMessage.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetMyMessagesQueryKey(),
          });
          queryClient.invalidateQueries({ queryKey: getGetMyStatsQueryKey() });
          toast({ title: "Message deleted" });
        },
      },
    );
  };

  const handleReply = (id: string) => {
    if (!replyText.trim()) return;
    replyToMessage.mutate(
      { id, data: { reply: replyText.trim() } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetMyMessagesQueryKey(),
          });
          setReplyingTo(null);
          setReplyText("");
          toast({ title: "Reply sent!" });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to send reply.",
            variant: "destructive",
          });
        },
      },
    );
  };

  const handleToggleGlobalVisibility = () => {
    if (!profile) return;
    const next = !profile.defaultPublicMessages;
    updateProfile.mutate(
      { data: { defaultPublicMessages: next } },
      {
        onSuccess: (updated) => {
          queryClient.setQueryData(getGetMyProfileQueryKey(), updated);
          queryClient.invalidateQueries({
            queryKey: getGetMyMessagesQueryKey(),
          });
          toast({
            title: next
              ? "Pesan ditampilkan di profil"
              : "Pesan disembunyikan dari profil",
            description: next
              ? "Semua pesan sekarang terlihat di profil publikmu."
              : "Semua pesan sekarang disembunyikan dari profil publikmu.",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to update visibility.",
            variant: "destructive",
          });
        },
      },
    );
  };

  const handleCreateCampaign = () => {
    if (!campaignTitle.trim() || !campaignQuestion.trim()) return;
    createCampaign.mutate(
      {
        data: {
          title: campaignTitle.trim(),
          question: campaignQuestion.trim(),
          color: campaignColor,
          icon: campaignIcon,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetMyCampaignQueryKey(),
          });
          setCampaignTitle("");
          setCampaignQuestion("");
          setCampaignColor("teal");
          setCampaignIcon("megaphone");
          setShowCampaignForm(false);
          toast({
            title: "Kampanye aktif!",
            description: "Pertanyaanmu kini tampil di profil publik.",
          });
        },
        onError: () => {
          toast({
            title: "Gagal",
            description: "Tidak bisa membuat kampanye.",
            variant: "destructive",
          });
        },
      },
    );
  };

  const handleEndCampaign = (id: string) => {
    endCampaign.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetMyCampaignQueryKey(),
          });
          toast({
            title: "Kampanye diakhiri",
            description: "Pertanyaan tidak lagi tampil di profilmu.",
          });
        },
        onError: () => {
          toast({
            title: "Gagal",
            description: "Tidak bisa mengakhiri kampanye.",
            variant: "destructive",
          });
        },
      },
    );
  };

  if (profileLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <Skeleton className="h-36 w-full" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
          <Skeleton className="h-[400px] w-full" />
        </div>
      </AppLayout>
    );
  }

  if (!profile) return null;

  const handleOnboardingSave = () => {
    const trimmedUsername = onboardingUsername.trim();
    if (!trimmedUsername || trimmedUsername.length < 3) return;
    if (checkingUsername || debouncedUsername !== trimmedUsername) return;
    if (!usernameCheck?.available) return;
    updateProfile.mutate(
      {
        data: {
          username: trimmedUsername,
          ...(onboardingDisplayName.trim() && {
            displayName: onboardingDisplayName.trim(),
          }),
        },
      },
      {
        onSuccess: (updated) => {
          queryClient.setQueryData(getGetMyProfileQueryKey(), updated);
          setShowConfetti(true);
          toast({
            title: "Profil disimpan!",
            description: "Selamat, selamat datang!",
          });
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.error === "username_taken"
              ? "Username sudah dipakai, coba yang lain."
              : "Gagal menyimpan, coba lagi.";
          toast({ title: "Gagal", description: msg, variant: "destructive" });
        },
      },
    );
  };

  const messages = messagesData?.messages || [];
  const displayName = profile.displayName || profile.username;
  const initials = displayName.charAt(0).toUpperCase();
  const isPublic = profile.defaultPublicMessages;

  const counts = {
    all: messages.length,
    unread: messages.filter((m) => !m.isRead).length,
    unreplied: messages.filter((m) => !m.ownerReply).length,
    public: messages.filter((m) => m.isPublic).length,
  };

  const searchQ = searchQuery.trim().toLowerCase();
  const filteredMessages = messages.filter((m) => {
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "unread" && !m.isRead) ||
      (activeFilter === "unreplied" && !m.ownerReply) ||
      (activeFilter === "public" && m.isPublic);
    const matchesSearch = !searchQ || m.content.toLowerCase().includes(searchQ);
    return matchesFilter && matchesSearch;
  });

  return (
    <AppLayout>
      {/* Onboarding modal for new users */}
      <Dialog open={!profile.hasSetUsername}>
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={(e) => e.preventDefault()}
          hideCloseButton
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Selamat datang! 👋
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Buat username dan nama tampil agar profilmu terlihat menarik dan
              mudah dikenali.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="ob-username" className="text-sm font-medium">
                Username <span className="text-destructive">*</span>
              </Label>
              <Input
                id="ob-username"
                placeholder="misalnya: john123"
                value={onboardingUsername}
                onChange={(e) =>
                  setOnboardingUsername(
                    e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
                  )
                }
                onKeyDown={(e) => e.key === "Enter" && handleOnboardingSave()}
                maxLength={32}
                autoFocus
              />
              <div className="min-h-[18px]">
                {onboardingUsername.trim().length > 0 &&
                  onboardingUsername.trim().length < 3 && (
                    <p className="text-xs text-muted-foreground">
                      Minimal 3 karakter
                    </p>
                  )}
                {onboardingUsername.trim().length >= 3 && checkingUsername && (
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Spinner className="size-3" />
                    Memeriksa ketersediaan...
                  </span>
                )}
                {onboardingUsername.trim().length >= 3 &&
                  !checkingUsername &&
                  usernameCheck?.available === true &&
                  debouncedUsername === onboardingUsername.trim() && (
                    <p className="text-xs text-emerald-600 font-medium">
                      ✓ Username tersedia
                    </p>
                  )}
                {onboardingUsername.trim().length >= 3 &&
                  !checkingUsername &&
                  usernameCheck?.available === false &&
                  debouncedUsername === onboardingUsername.trim() && (
                    <p className="text-xs text-destructive font-medium">
                      ✗ Username sudah dipakai
                    </p>
                  )}
              </div>
              <p className="text-xs text-muted-foreground">
                Link anonimmu:{" "}
                <span className="font-mono text-foreground">
                  /@{onboardingUsername || "username"}
                </span>
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ob-displayname" className="text-sm font-medium">
                Nama tampil{" "}
                <span className="text-muted-foreground font-normal">
                  (opsional)
                </span>
              </Label>
              <Input
                id="ob-displayname"
                placeholder="misalnya: John Doe"
                value={onboardingDisplayName}
                onChange={(e) => setOnboardingDisplayName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleOnboardingSave()}
                maxLength={64}
              />
            </div>
            <Button
              className="w-full"
              onClick={handleOnboardingSave}
              disabled={
                !onboardingUsername.trim() ||
                onboardingUsername.trim().length < 3 ||
                checkingUsername ||
                usernameCheck?.available !== true ||
                debouncedUsername !== onboardingUsername.trim() ||
                updateProfile.isPending
              }
            >
              {updateProfile.isPending ? "Menyimpan..." : "Simpan & Mulai"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
        {/* Profile + Link Combined Card */}
        <div className="border border-border bg-white rounded-md overflow-hidden shadow-sm">
          <div className="bg-primary/10 border-b border-primary/20 px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row items-center gap-4">
            <div className="shrink-0">
              {resolveAvatarUrl(profile.avatarUrl) ? (
                <LazyAvatar
                  src={resolveAvatarUrl(profile.avatarUrl)!}
                  alt={displayName}
                  className="w-16 h-16 border-2 border-white shadow"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground border-2 border-white shadow">
                  {initials}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-foreground leading-none">
                  {displayName}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                @{profile.username}
              </p>
              {profile.bio && (
                <p className="text-sm text-foreground/70 mt-2 line-clamp-2">
                  {profile.bio}
                </p>
              )}
            </div>
            <div className="shrink-0 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1.5"
                onClick={() => window.open(`/@${profile.username}`, "_blank")}
              >
                <ExternalLink className="w-3.5 h-3.5" /> Preview
              </Button>
            </div>
          </div>
          <div className="px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex items-center gap-2 flex-1 min-w-0 text-xs text-muted-foreground">
              <Link2 className="w-3.5 h-3.5 shrink-0 text-primary" />
              <span className="truncate font-mono text-xs">{publicUrl}</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto sm:shrink-0">
              <Button
                onClick={copyLink}
                size="sm"
                className="flex-1 sm:flex-none gap-2 text-xs"
                variant="outline"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {copied ? "Tersalin!" : "Salin Link"}
              </Button>
              <Button
                onClick={() => setShowQRCard(true)}
                size="sm"
                className="flex-1 sm:flex-none gap-2 text-xs"
                style={{
                  background:
                    "linear-gradient(135deg, #0f172a 0%, #164e3a 100%)",
                  color: "#86ead4",
                  border: "1px solid #86ead430",
                }}
              >
                <Download className="w-3.5 h-3.5" />
                Kartu QR
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            icon={<MessageSquare className="w-4.5 h-4.5" />}
            label="Total Pesan"
            value={stats?.totalMessages ?? 0}
            accent="mint"
            loading={statsLoading}
          />
          <StatCard
            icon={<Eye className="w-4.5 h-4.5" />}
            label="Link Dibuka"
            value={stats?.linkOpens ?? 0}
            accent="blue"
            loading={statsLoading}
          />
          <StatCard
            icon={<CornerDownRight className="w-4.5 h-4.5" />}
            label="Belum Dibalas"
            value={stats?.unrepliedMessages ?? 0}
            accent="orange"
            loading={statsLoading}
          />
          <StatCard
            icon={<Star className="w-4.5 h-4.5" />}
            label="Poin Tersedia"
            value={
              referralStats?.availablePoints ?? referralStats?.totalPoints ?? 0
            }
            accent="amber"
            loading={statsLoading}
          />
        </div>

        {/* Banner Iklan */}
        <BannerAd className="mb-1" />

        {/* Wrapped + Kampanye QnA — merged collapsible card */}
        <div
          className="rounded-md overflow-hidden"
          style={{ border: "1px solid #86ead430" }}
        >
          {/* ── Wrapped section (always visible) ── */}
          <Link href="/wrapped" className="block">
            <div
              className="relative px-6 py-4 flex items-center justify-between gap-4 cursor-pointer group transition-opacity hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #0c2318 100%)",
              }}
            >
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="absolute top-1/2 right-8 -translate-y-1/2 w-28 h-28 rounded-full opacity-15"
                  style={{
                    background: "radial-gradient(circle, #86ead4, transparent)",
                  }}
                />
              </div>
              <div className="flex items-center gap-3 relative">
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                  style={{
                    background: "#86ead420",
                    border: "1px solid #86ead440",
                  }}
                >
                  <Sparkles className="w-4 h-4" style={{ color: "#86ead4" }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-none mb-0.5">
                    {appName} Wrapped
                  </p>
                  <p className="text-xs" style={{ color: "#94a3b8" }}>
                    Lihat recap statistik pesanmu ✨
                  </p>
                </div>
              </div>
              <span
                className="relative shrink-0 flex items-center gap-1 text-xs font-semibold group-hover:translate-x-0.5 transition-transform"
                style={{ color: "#86ead4" }}
              >
                Buka →
              </span>
            </div>
          </Link>

          {/* ── Premium CTA ── */}
          {!profile?.isPremium && (
            <div
              className="flex items-center justify-between gap-3 px-5 py-3"
              style={{
                background: "rgba(251,191,36,0.08)",
                borderTop: "1px solid rgba(251,191,36,0.22)",
              }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Crown className="w-4 h-4 text-amber-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-amber-900 leading-none mb-0.5">
                    Upgrade ke Premium
                  </p>
                  <p className="text-[10px] text-amber-700/70 truncate">
                    Buka social links, kampanye QnA, notifikasi email, dan lebih
                    banyak lagi.
                  </p>
                </div>
              </div>
              <Link href="/upgrade" className="shrink-0">
                <Button
                  size="sm"
                  className="h-7 px-3 text-xs font-semibold shadow-none"
                  style={{
                    background: "#f59e0b",
                    color: "#fff",
                    border: "none",
                  }}
                >
                  Upgrade →
                </Button>
              </Link>
            </div>
          )}

          {/* ── Kampanye QnA section (collapsible) ── */}
          <div className="bg-white">
            {/* Toggle row */}
            <button
              type="button"
              onClick={() => setCampaignOpen((o) => !o)}
              className="w-full flex items-center justify-between gap-3 px-5 py-3 text-left hover:bg-secondary/30 transition-colors"
              style={{ borderTop: "1px solid rgba(134,234,212,0.18)" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-primary/15 flex items-center justify-center">
                  <Megaphone className="w-3 h-3 text-primary" />
                </div>
                <span className="text-xs font-semibold text-foreground">
                  Kampanye QnA
                </span>
                {campaign != null && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-1.5 py-0.5 rounded-md">
                    <Radio className="w-2.5 h-2.5" /> LIVE
                  </span>
                )}
              </div>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${campaignOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Collapsible body */}
            {campaignOpen && (
              <div className="border-t border-border">
                {!profile?.isPremium ? (
                  <div className="px-5 py-5 flex items-start gap-4">
                    <div className="w-9 h-9 rounded-md bg-amber-100 flex items-center justify-center shrink-0">
                      <Crown className="w-4.5 h-4.5 text-amber-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold mb-1">
                        Fitur Eksklusif Premium
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                        Buat pertanyaan atau topik yang tampil menonjol di
                        profilmu. Pengunjung langsung tahu apa yang ingin kamu
                        tanyakan.
                      </p>
                      <Link href="/upgrade">
                        <Button
                          size="sm"
                          className="gap-1.5 text-xs bg-amber-500 hover:bg-amber-600 text-white border-0 shadow-none"
                        >
                          <Crown className="w-3.5 h-3.5" /> Upgrade ke Premium
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : campaignLoading ? (
                  <div className="px-5 py-4 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                ) : campaign ? (
                  <div className="px-5 py-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                          {campaign.title} ·{" "}
                          {formatDistanceToNow(new Date(campaign.createdAt), {
                            addSuffix: true,
                            locale: idLocale,
                          })}
                        </p>
                        <p className="text-sm font-medium text-foreground leading-snug">
                          {campaign.question}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-xl font-bold text-primary leading-none">
                          {campaign.responseCount}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          respons
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-1 border-t border-border">
                      <p className="text-xs text-muted-foreground flex-1">
                        Aktif di halaman profilmu sekarang.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 px-3 gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/5"
                        onClick={() => handleEndCampaign(campaign.id)}
                        disabled={endCampaign.isPending}
                      >
                        <X className="w-3 h-3" /> Akhiri
                      </Button>
                    </div>
                  </div>
                ) : showCampaignForm ? (
                  <div className="px-5 py-4 space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                        Nama Kampanye
                      </label>
                      <Input
                        placeholder="Cth: Feedback Jujur, Ask Me Anything..."
                        value={campaignTitle}
                        onChange={(e) => setCampaignTitle(e.target.value)}
                        maxLength={100}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                        Pertanyaan / Topik
                      </label>
                      <Textarea
                        placeholder="Cth: Apa yang menurutmu perlu aku perbaiki? Tanya apapun tentang coding ke aku!"
                        value={campaignQuestion}
                        onChange={(e) => setCampaignQuestion(e.target.value)}
                        maxLength={500}
                        className="resize-none min-h-[80px] text-sm"
                      />
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {campaignQuestion.length}/500
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                          Warna
                        </label>
                        <div className="flex gap-2">
                          {CAMPAIGN_COLORS.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => setCampaignColor(c.id)}
                              title={c.label}
                              className={`w-6 h-6 rounded-full transition-all ${campaignColor === c.id ? "ring-2 ring-offset-2 ring-foreground/50 scale-110" : "hover:scale-105 opacity-70 hover:opacity-100"}`}
                              style={{ background: c.swatch }}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                          Ikon
                        </label>
                        <div className="flex gap-1.5 flex-wrap">
                          {CAMPAIGN_ICONS.map(({ id, icon: Icon, label }) => (
                            <button
                              key={id}
                              type="button"
                              title={label}
                              onClick={() => setCampaignIcon(id)}
                              className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
                                campaignIcon === id
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary text-muted-foreground hover:bg-secondary/60"
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    {(campaignTitle || campaignQuestion) && (
                      <div className="rounded-md overflow-hidden">
                        <div
                          className="px-3 py-2 flex items-center gap-2"
                          style={{
                            background: CAMPAIGN_COLORS.find(
                              (c) => c.id === campaignColor,
                            )?.gradient,
                          }}
                        >
                          <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                            {(() => {
                              const CI =
                                CAMPAIGN_ICONS.find(
                                  (i) => i.id === campaignIcon,
                                )?.icon ?? Megaphone;
                              return <CI className="w-3.5 h-3.5 text-white" />;
                            })()}
                          </div>
                          <p className="text-xs font-semibold text-white truncate flex-1">
                            {campaignQuestion ||
                              campaignTitle ||
                              "Pertanyaan kampanye..."}
                          </p>
                          <span className="text-[9px] font-bold text-white/80 bg-white/20 rounded-full px-2 py-0.5 shrink-0">
                            LIVE
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        size="sm"
                        className="gap-1.5 text-xs"
                        onClick={handleCreateCampaign}
                        disabled={
                          createCampaign.isPending ||
                          !campaignTitle.trim() ||
                          !campaignQuestion.trim()
                        }
                      >
                        <Megaphone className="w-3.5 h-3.5" />
                        {createCampaign.isPending
                          ? "Membuat..."
                          : "Aktifkan Kampanye"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-muted-foreground"
                        onClick={() => {
                          setShowCampaignForm(false);
                          setCampaignTitle("");
                          setCampaignQuestion("");
                          setCampaignColor("teal");
                          setCampaignIcon("megaphone");
                        }}
                      >
                        Batal
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="px-5 py-5 flex items-center gap-4">
                    <div className="w-9 h-9 rounded-md bg-secondary flex items-center justify-center shrink-0">
                      <Megaphone className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold mb-0.5">
                        Belum ada kampanye aktif
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Buat pertanyaan yang tampil di profilmu untuk memancing
                        lebih banyak respons.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="gap-1.5 text-xs shrink-0"
                      onClick={() => setShowCampaignForm(true)}
                    >
                      <Plus className="w-3.5 h-3.5" /> Buat
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Inbox */}
        <div>
          {/* Inbox header row */}
          <div className="flex items-center gap-2 mb-3">
            <Inbox className="w-4 h-4 text-foreground" />
            <h2 className="text-sm font-semibold">Inbox</h2>
            {messages.length > 0 && (
              <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-md">
                {messages.length}
              </span>
            )}
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-muted-foreground hidden sm:block">
                {isPublic
                  ? "Pesan tampil di profil"
                  : "Pesan disembunyikan dari profil"}
              </span>
              <button
                type="button"
                onClick={handleToggleGlobalVisibility}
                disabled={updateProfile.isPending}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                  isPublic ? "bg-primary" : "bg-input"
                }`}
                role="switch"
                aria-checked={isPublic}
                title={
                  isPublic
                    ? "Klik untuk sembunyikan pesan dari profil"
                    : "Klik untuk tampilkan pesan di profil"
                }
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-background shadow-lg ring-0 transition-transform ${
                    isPublic ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span
                className={`text-xs font-semibold flex items-center gap-1 ${isPublic ? "text-primary" : "text-muted-foreground"}`}
              >
                {isPublic ? (
                  <>
                    <Globe className="w-3 h-3" /> Publik
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3" /> Privat
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Filter tabs + search */}
          {messages.length > 0 && (
            <div className="mb-3 space-y-2">
              {/* Pill tabs */}
              <div className="flex items-center gap-1 p-1 bg-secondary rounded-md overflow-x-auto">
                {(
                  [
                    { key: "all", label: "Semua", count: counts.all },
                    {
                      key: "unreplied",
                      label: "Belum Dibalas",
                      count: counts.unreplied,
                    },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveFilter(tab.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded whitespace-nowrap transition-all shrink-0 ${
                      activeFilter === tab.key
                        ? "bg-white text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        activeFilter === tab.key
                          ? "bg-primary/20 text-primary-foreground/80"
                          : "bg-border/60 text-muted-foreground"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
              {/* Search bar */}
              <div className="bg-white border border-border rounded-md px-3 py-2.5 flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari pesan..."
                  className="flex-1 text-xs bg-transparent outline-none placeholder:text-muted-foreground/60"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {messagesLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-28 w-full" />
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="border border-dashed border-border bg-secondary/20 py-16 text-center flex flex-col items-center rounded-md">
              <div className="w-12 h-12 bg-secondary rounded-md flex items-center justify-center mb-3">
                <Inbox className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-semibold mb-1">Belum ada pesan</h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                Bagikan linkmu untuk mulai menerima pesan anonim.
              </p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="border border-dashed border-border bg-secondary/20 py-12 text-center flex flex-col items-center rounded-md">
              <div className="w-11 h-11 bg-secondary rounded-md flex items-center justify-center mb-3">
                <Search className="w-5 h-5 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-semibold mb-1">
                {searchQ
                  ? `Tidak ada pesan yang cocok dengan "${searchQuery}"`
                  : activeFilter === "unread"
                    ? "Tidak ada pesan yang belum dibaca"
                    : activeFilter === "unreplied"
                      ? "Semua pesan sudah dibalas"
                      : activeFilter === "public"
                        ? "Belum ada pesan yang dipublikasikan"
                        : "Tidak ada pesan"}
              </h3>
              <p className="text-xs text-muted-foreground max-w-xs">
                {searchQ
                  ? "Coba kata kunci yang berbeda."
                  : "Coba tab filter lain."}
              </p>
              {(activeFilter !== "all" || searchQ) && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveFilter("all");
                    setSearchQuery("");
                  }}
                  className="mt-3 text-xs text-primary font-semibold hover:underline"
                >
                  Reset filter
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMessages.slice(0, visibleCount).map((message, idx) => {
                const palette = [
                  {
                    bg: "rgba(134,234,212,0.12)",
                    border: "rgba(134,234,212,0.40)",
                    stripe: "linear-gradient(to right, #86ead4, #60c4ae)",
                  },
                  {
                    bg: "rgba(165,180,252,0.12)",
                    border: "rgba(165,180,252,0.40)",
                    stripe: "linear-gradient(to right, #86ead4, #818cf8)",
                  },
                  {
                    bg: "rgba(147,197,253,0.12)",
                    border: "rgba(147,197,253,0.40)",
                    stripe: "linear-gradient(to right, #93c5fd, #6ee7b7)",
                  },
                  {
                    bg: "rgba(252,211,77,0.12)",
                    border: "rgba(252,211,77,0.40)",
                    stripe: "linear-gradient(to right, #fcd34d, #86ead4)",
                  },
                ];
                const { bg, border, stripe } = palette[idx % palette.length];
                return (
                  <div
                    key={message.id}
                    className="rounded-md shadow-sm overflow-hidden"
                    style={{ background: bg, border: `1px solid ${border}` }}
                  >
                    {/* Stripe */}
                    <div style={{ height: 3, background: stripe }} />

                    {/* Message Header: icon + Anonymous + unread dot + timestamp */}
                    <div className="px-5 pt-3 pb-2 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-white/70 border border-white/60 flex items-center justify-center shrink-0">
                        <User className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <span className="text-xs font-semibold text-foreground/70">
                        Anonim
                      </span>
                      {message.senderEmail && (
                        <span
                          title="Pengirim akan dinotifikasi jika dibalas"
                          className="inline-flex items-center shrink-0"
                        >
                          <Mail className="w-3 h-3 text-teal-500" />
                        </span>
                      )}
                      {!message.isRead && (
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: "var(--sky-foreground)" }}
                        />
                      )}
                      <span className="text-[10px] text-muted-foreground ml-auto">
                        {formatDistanceToNow(new Date(message.createdAt), {
                          addSuffix: true,
                          locale: idLocale,
                        })}
                      </span>
                    </div>

                    {/* Message Content */}
                    <div className="px-5 pb-3">
                      <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>

                    {/* Owner Reply (if exists) */}
                    {message.ownerReply && (
                      <div className="mx-5 mb-3 border border-primary/20 bg-white/60 rounded-md p-3">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                            <span className="text-[9px] font-bold text-primary-foreground">
                              {initials}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-accent-foreground">
                            Kamu (Pemilik)
                          </span>
                          {message.ownerRepliedAt && (
                            <span className="text-[10px] text-muted-foreground ml-auto">
                              {formatDistanceToNow(
                                new Date(message.ownerRepliedAt),
                                { addSuffix: true, locale: idLocale },
                              )}
                            </span>
                          )}
                        </div>
                        <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
                          {message.ownerReply}
                        </p>
                      </div>
                    )}

                    {/* Reply Input (if open) */}
                    {replyingTo === message.id && (
                      <div className="mx-5 mb-3 space-y-2">
                        {message.senderEmail && (
                          <div className="flex flex-col gap-1">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-teal-50 border border-teal-200 w-fit">
                              <Mail className="w-3 h-3 text-teal-600 shrink-0" />
                              <span className="text-xs font-medium text-teal-700">
                                Email: {maskEmail(message.senderEmail!)}
                              </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                              Email notifikasi akan dikirim ke pengirim saat
                              kamu membalas
                            </p>
                          </div>
                        )}
                        <Textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Tulis balasanmu..."
                          className="text-sm resize-none min-h-[80px] bg-white/80"
                          autoFocus
                        />
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs bg-white/60"
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText("");
                            }}
                          >
                            Batal
                          </Button>
                          <Button
                            size="sm"
                            className="text-xs gap-1.5"
                            onClick={() => handleReply(message.id)}
                            disabled={
                              !replyText.trim() || replyToMessage.isPending
                            }
                          >
                            <Send className="w-3 h-3" />
                            {replyToMessage.isPending
                              ? "Mengirim..."
                              : "Kirim Balasan"}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div
                      className="border-t px-4 py-2.5 flex items-center gap-2 bg-white/30"
                      style={{ borderColor: border }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs gap-1.5 h-7 px-3 bg-white/70 hover:bg-white border-border/50 text-foreground/70 hover:text-foreground shadow-none"
                        onClick={() => {
                          if (replyingTo === message.id) {
                            setReplyingTo(null);
                            setReplyText("");
                          } else {
                            setReplyingTo(message.id);
                            setReplyText(message.ownerReply ?? "");
                          }
                        }}
                      >
                        <CornerUpLeft className="w-3.5 h-3.5" />
                        {message.ownerReply ? "Edit Balasan" : "Balas"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs gap-1.5 h-7 px-3 bg-white/70 hover:bg-white border-border/50 text-foreground/70 hover:text-foreground shadow-none"
                        onClick={() =>
                          setSharingMessage({ id: message.id, idx })
                        }
                      >
                        <Share className="w-3.5 h-3.5" />
                        Bagikan
                      </Button>
                      <div className="flex-1" />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-white/50"
                        onClick={() => handleDelete(message.id)}
                        disabled={deleteMessage.isPending}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredMessages.length > visibleCount && (
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-xs"
                onClick={() => setVisibleCount((v) => v + 5)}
              >
                Muat Lebih ({filteredMessages.length - visibleCount} pesan lagi)
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {sharingMessage &&
        (() => {
          const msg = messages.find((m) => m.id === sharingMessage.id);
          if (!msg) return null;
          return (
            <ShareMessageCard
              content={msg.content}
              createdAt={msg.createdAt}
              ownerReply={msg.ownerReply}
              paletteIdx={sharingMessage.idx}
              displayName={displayName}
              username={profile.username!}
              avatarUrl={profile.avatarUrl}
              totalMessages={stats?.totalMessages ?? 0}
              onClose={() => setSharingMessage(null)}
            />
          );
        })()}
      {/* QR Profile Card Modal */}
      {showQRCard && profile && (
        <QRProfileCard
          displayName={profile.displayName || profile.username || ""}
          username={profile.username!}
          bio={profile.bio}
          avatarUrl={profile.avatarUrl}
          totalMessages={stats?.totalMessages ?? 0}
          paletteIdx={0}
          onClose={() => setShowQRCard(false)}
        />
      )}
    </AppLayout>
  );
}
