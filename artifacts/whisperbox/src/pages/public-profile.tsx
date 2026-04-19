import { useState, useRef, useCallback } from "react";
import { useParams, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@clerk/react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Send,
  User,
  Lock,
  CornerDownRight,
  Instagram,
  Github,
  Linkedin,
  Facebook,
  Megaphone,
  X,
  HelpCircle,
  MessageCircle,
  Flame,
  Star,
  Zap,
  Heart,
  Sparkles,
  Mail,
  ChevronRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";

const TURNSTILE_SITE_KEY =
  import.meta.env.VITE_TURNSTILE_SITE_KEY ?? "1x00000000000000000000AA";

import {
  useGetPublicProfile,
  useSendMessage,
  useGetPublicCampaign,
} from "@workspace/api-client-react";
import { resolveAvatarUrl } from "@/lib/avatar";

const CAMPAIGN_COLORS = [
  {
    id: "teal",
    gradient: "linear-gradient(135deg, #0d9488 0%, #14b8a6 60%, #2dd4bf 100%)",
  },
  {
    id: "violet",
    gradient: "linear-gradient(135deg, #6d28d9 0%, #7c3aed 50%, #8b5cf6 100%)",
  },
  {
    id: "sky",
    gradient: "linear-gradient(135deg, #0369a1 0%, #0ea5e9 60%, #38bdf8 100%)",
  },
  {
    id: "amber",
    gradient: "linear-gradient(135deg, #b45309 0%, #d97706 50%, #fbbf24 100%)",
  },
  {
    id: "rose",
    gradient: "linear-gradient(135deg, #be123c 0%, #e11d48 50%, #fb7185 100%)",
  },
];

const CAMPAIGN_ICONS: Record<string, React.ElementType> = {
  megaphone: Megaphone,
  "help-circle": HelpCircle,
  "message-circle": MessageCircle,
  flame: Flame,
  star: Star,
  zap: Zap,
  heart: Heart,
  sparkles: Sparkles,
};

const messageSchema = z.object({
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message too long"),
  senderEmail: z
    .string()
    .email("Format email tidak valid")
    .or(z.literal(""))
    .optional(),
});

type MessageFormValues = z.infer<typeof messageSchema>;

function TiktokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.19 8.19 0 0 0 4.79 1.54V6.78a4.85 4.85 0 0 1-1.02-.09z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

type SocialLinks = {
  socialInstagram?: string | null;
  socialTiktok?: string | null;
  socialX?: string | null;
  socialFacebook?: string | null;
  socialGithub?: string | null;
  socialLinkedin?: string | null;
};

function SocialLinkBar({ links }: { links: SocialLinks }) {
  const items = [
    {
      key: "socialInstagram",
      href: (v: string) => `https://instagram.com/${v}`,
      icon: <Instagram className="w-4 h-4" />,
      label: "Instagram",
      color: "#E1306C",
    },
    {
      key: "socialTiktok",
      href: (v: string) => `https://tiktok.com/@${v}`,
      icon: <TiktokIcon className="w-4 h-4" />,
      label: "TikTok",
      color: "#010101",
    },
    {
      key: "socialX",
      href: (v: string) => `https://x.com/${v}`,
      icon: <XIcon className="w-4 h-4" />,
      label: "X",
      color: "#000000",
    },
    {
      key: "socialFacebook",
      href: (v: string) => `https://facebook.com/${v}`,
      icon: <Facebook className="w-4 h-4" />,
      label: "Facebook",
      color: "#1877F2",
    },
    {
      key: "socialGithub",
      href: (v: string) => `https://github.com/${v}`,
      icon: <Github className="w-4 h-4" />,
      label: "GitHub",
      color: "#24292e",
    },
    {
      key: "socialLinkedin",
      href: (v: string) => `https://linkedin.com/in/${v}`,
      icon: <Linkedin className="w-4 h-4" />,
      label: "LinkedIn",
      color: "#0A66C2",
    },
  ];

  const active = items.filter(
    (item) => !!(links as Record<string, unknown>)[item.key],
  );
  if (active.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {active.map((item) => {
        const value = (links as Record<string, string>)[item.key];
        return (
          <a
            key={item.key}
            href={item.href(value)}
            target="_blank"
            rel="noopener noreferrer"
            title={item.label}
            style={{ color: item.color }}
            className="w-9 h-9 rounded-md bg-white border border-border hover:border-border/60 flex items-center justify-center transition-all duration-150 hover:shadow-sm"
          >
            {item.icon}
          </a>
        );
      })}
    </div>
  );
}

export default function PublicProfilePage() {
  const params = useParams<{ handle: string }>();
  const rawHandle = params.handle ?? "";
  const username = rawHandle.startsWith("@") ? rawHandle.slice(1) : rawHandle;
  const { toast } = useToast();
  const { isSignedIn } = useAuth();
  const [bubbleDismissed, setBubbleDismissed] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const [emailSectionOpen, setEmailSectionOpen] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileReady, setTurnstileReady] = useState(false);
  const turnstileRef = useRef<TurnstileInstance>(null);

  const { data: profile, isLoading, isError } = useGetPublicProfile(username);
  const sendMessage = useSendMessage();
  const { data: activeCampaign } = useGetPublicCampaign(username);

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: "", senderEmail: "" },
  });

  const closeEmailSection = useCallback(() => {
    setEmailSectionOpen(false);
    setTurnstileToken(null);
    setTurnstileReady(false);
    form.setValue("senderEmail", "");
    form.clearErrors("senderEmail");
  }, [form]);

  const onSubmit = (data: MessageFormValues) => {
    const emailTrimmed = data.senderEmail?.trim() ?? "";
    const hasEmail = emailSectionOpen && emailTrimmed !== "";
    const payload = {
      content: data.content,
      ...(hasEmail && { senderEmail: emailTrimmed }),
      ...(hasEmail && turnstileToken ? { turnstileToken } : {}),
    };
    sendMessage.mutate(
      { username, data: payload },
      {
        onSuccess: () => {
          form.reset();
          closeEmailSection();
          turnstileRef.current?.reset();
          toast({
            title: "Pesan terkirim!",
            description: "Pesan anonim kamu berhasil dikirim.",
          });
        },
        onError: (err: unknown) => {
          const apiErr = err as {
            status?: number;
            data?: { retryAfterMinutes?: number; error?: string };
          };
          if (apiErr?.status === 429) {
            const mins = apiErr.data?.retryAfterMinutes;
            toast({
              title: "Batas pengiriman tercapai",
              description: mins
                ? `Kamu sudah mencapai batas pesan. Coba lagi dalam ${mins} menit.`
                : "Kamu sudah mencapai batas pesan. Coba lagi nanti.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Gagal mengirim",
              description: "Terjadi kesalahan. Coba lagi.",
              variant: "destructive",
            });
          }
          turnstileRef.current?.reset();
          setTurnstileToken(null);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-background text-foreground flex flex-col">
        <header className="border-b border-border bg-white sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-5 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-sm text-foreground"
            >
              <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center text-primary-foreground text-xs font-bold">
                W
              </div>
              WhisperBox
            </Link>
          </div>
        </header>
        <div className="flex-1 flex flex-col items-center p-6 py-10">
          <div className="w-full max-w-4xl space-y-6">
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <Skeleton className="w-24 h-24 rounded-full shrink-0" />
              <div className="space-y-2 flex flex-col items-center">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <Skeleton className="h-[220px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="min-h-[100dvh] bg-background text-foreground flex flex-col">
        <header className="border-b border-border bg-white sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-5 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-sm text-foreground"
            >
              <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center text-primary-foreground text-xs font-bold">
                W
              </div>
              WhisperBox
            </Link>
            <Link href="/">
              <Button size="sm" className="text-xs">
                Mulai Gratis
              </Button>
            </Link>
          </div>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="border border-border bg-white p-12 shadow-sm text-center max-w-sm w-full rounded-md">
            <User className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-xl font-bold mb-2">User Not Found</h1>
            <p className="text-muted-foreground text-sm mb-8">
              The user '{username}' does not exist.
            </p>
            <Link href="/">
              <Button variant="outline" className="w-full">
                Return Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const displayName = profile.displayName || `@${profile.username}`;
  const initials = displayName.charAt(0).toUpperCase();
  const publicMessages = profile.publicMessages ?? [];
  const avatarUrl = resolveAvatarUrl(profile.avatarUrl);

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col">
      {/* Nav */}
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-sm text-foreground"
          >
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center text-primary-foreground text-xs font-bold">
              W
            </div>
            WhisperBox
          </Link>
          <Link href="/">
            <Button size="sm" className="text-xs">
              Mulai Gratis
            </Button>
          </Link>
        </div>
      </header>

      <div className="flex-1 max-w-4xl mx-auto px-6 py-8 w-full space-y-6">
        {/* Profile Hero — no card, centered */}
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          {/* Avatar */}
          <div className="shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                loading="lazy"
                decoding="async"
                className="w-24 h-24 rounded-full object-cover border-2 border-primary/20 shadow-sm ring-4 ring-primary/10"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-3xl font-bold text-primary-foreground border-2 border-primary/20 shadow-sm ring-4 ring-primary/10">
                {initials}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-2">
            <div>
              <h1 className="text-2xl font-bold leading-tight text-foreground">
                {displayName}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                @{profile.username}
              </p>
            </div>
            {profile.bio && (
              <p className="text-sm text-foreground/70 leading-relaxed max-w-sm mx-auto">
                {profile.bio}
              </p>
            )}
            <SocialLinkBar links={profile} />
          </div>
        </div>

        {/* Divider with accent */}
        <div className="relative">
          <div className="h-px bg-border" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </div>

        {/* Today's Question — compact banner */}
        {activeCampaign != null && (
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("send-form");
              el?.scrollIntoView({ behavior: "smooth" });
              (el?.querySelector("textarea") as HTMLElement | null)?.focus();
            }}
            className="group w-full rounded-md overflow-hidden text-left transition-transform hover:scale-[1.005] active:scale-[0.995]"
            style={{
              background:
                CAMPAIGN_COLORS.find(
                  (c) => c.id === (activeCampaign.color ?? "teal"),
                )?.gradient ?? CAMPAIGN_COLORS[0].gradient,
            }}
          >
            <div className="px-4 py-3 flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                {(() => {
                  const CI =
                    CAMPAIGN_ICONS[activeCampaign.icon ?? "megaphone"] ??
                    Megaphone;
                  return <CI className="w-3.5 h-3.5 text-white" />;
                })()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-tight truncate">
                  {activeCampaign.question}
                </p>
              </div>
            </div>
          </button>
        )}

        {/* Send Message Card */}
        <div
          id="send-form"
          className="bg-white border border-border rounded-md overflow-hidden"
        >
          <div className="px-6 py-5">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-foreground">
                Kirim pesan ke {profile.displayName || `@${profile.username}`}
              </h2>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                <Lock className="w-3 h-3 shrink-0" />
                {profile.displayName || `@${profile.username}`} tidak akan tahu
                siapa pengirimnya
              </p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Tulis pesan anonimmu di sini..."
                          className="resize-none min-h-[120px] text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {profile.allowReplyNotif && (
                  <div>
                    {!emailSectionOpen ? (
                      <button
                        type="button"
                        onClick={() => setEmailSectionOpen(true)}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors group"
                      >
                        <Mail className="w-3 h-3 shrink-0" />
                        <span>
                          Mau dapat notifikasi jika{" "}
                          <span className="font-medium">
                            {profile.displayName || `@${profile.username}`}
                          </span>{" "}
                          membalas?
                        </span>
                        <ChevronRight className="w-3 h-3 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    ) : (
                      <div className="space-y-2 rounded-md border border-border bg-secondary/30 p-3 animate-in fade-in slide-in-from-top-1 duration-150">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3 shrink-0" />
                            Masukkan emailmu — kami kirim notif saat dibalas
                          </p>
                          <button
                            type="button"
                            onClick={closeEmailSection}
                            className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                            aria-label="Tutup"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <FormField
                          control={form.control}
                          name="senderEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <input
                                  type="email"
                                  placeholder="emailkamu@contoh.com"
                                  autoFocus
                                  className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-[11px]" />
                            </FormItem>
                          )}
                        />
                        <div className={turnstileReady ? "hidden" : ""}>
                          <p className="text-[10px] text-muted-foreground/70 flex items-center gap-1">
                            <span className="inline-block w-2.5 h-2.5 rounded-full border-2 border-muted-foreground/40 border-t-primary animate-spin" />
                            Memuat verifikasi…
                          </p>
                        </div>
                        <Turnstile
                          ref={turnstileRef}
                          siteKey={TURNSTILE_SITE_KEY}
                          onSuccess={(token) => {
                            setTurnstileToken(token);
                            setTurnstileReady(true);
                          }}
                          onError={() => {
                            setTurnstileToken(null);
                            setTurnstileReady(true);
                          }}
                          onExpire={() => setTurnstileToken(null)}
                          options={{ size: "invisible" }}
                        />
                        {turnstileReady && turnstileToken && (
                          <p className="text-[10px] text-green-600 flex items-center gap-1">
                            <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                            Verifikasi berhasil — email siap dikirim
                          </p>
                        )}
                        {turnstileReady && !turnstileToken && (
                          <p className="text-[10px] text-amber-600 flex items-center gap-1">
                            <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
                            Verifikasi gagal — email tidak akan disimpan
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={
                    sendMessage.isPending || !form.watch("content").trim()
                  }
                >
                  {sendMessage.isPending ? (
                    "Mengirim..."
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Kirim Anonim
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>

        {/* Public Messages */}
        {publicMessages.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Public Messages
              </h3>
              <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-md">
                {publicMessages.length}
              </span>
            </div>
            {publicMessages.slice(0, visibleCount).map((msg, idx) => {
              const palette = [
                {
                  stripe: "linear-gradient(to right, #86ead4, #60c4ae)",
                  bg: "rgba(134,234,212,0.10)",
                  border: "rgba(134,234,212,0.35)",
                },
                {
                  stripe: "linear-gradient(to right, #86ead4, #818cf8)",
                  bg: "rgba(165,180,252,0.10)",
                  border: "rgba(165,180,252,0.35)",
                },
                {
                  stripe: "linear-gradient(to right, #93c5fd, #6ee7b7)",
                  bg: "rgba(147,197,253,0.10)",
                  border: "rgba(147,197,253,0.35)",
                },
                {
                  stripe: "linear-gradient(to right, #fcd34d, #86ead4)",
                  bg: "rgba(252,211,77,0.10)",
                  border: "rgba(252,211,77,0.35)",
                },
              ];
              const { stripe, bg, border } = palette[idx % palette.length];
              return (
                <div
                  key={msg.id}
                  className="rounded-md shadow-sm overflow-hidden"
                  style={{ background: bg, border: `1px solid ${border}` }}
                >
                  {/* Stripe */}
                  <div style={{ height: 3, background: stripe }} />

                  {/* Header: icon + Anonim + timestamp */}
                  <div className="px-5 pt-3 pb-2 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/70 border border-white/60 flex items-center justify-center shrink-0">
                      <User className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <span className="text-xs font-semibold text-foreground/70">
                      Anonim
                    </span>
                    <span className="text-[10px] text-muted-foreground ml-auto">
                      {formatDistanceToNow(new Date(msg.createdAt), {
                        addSuffix: true,
                        locale: idLocale,
                      })}
                    </span>
                  </div>

                  {/* Message body */}
                  <div className="px-5 pb-3">
                    <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>

                  {msg.ownerReply && (
                    <div className="mx-5 mb-3 border border-primary/20 bg-white/60 rounded-md p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <span className="text-[9px] font-bold text-primary-foreground">
                            {initials}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-accent-foreground">
                          {displayName}
                        </span>
                        <CornerDownRight className="w-3 h-3 text-muted-foreground" />
                        {msg.ownerRepliedAt && (
                          <span className="text-[10px] text-muted-foreground ml-auto">
                            {formatDistanceToNow(new Date(msg.ownerRepliedAt), {
                              addSuffix: true,
                              locale: idLocale,
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
                        {msg.ownerReply}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Load more button */}
            {publicMessages.length > visibleCount && (
              <button
                type="button"
                onClick={() => setVisibleCount((v) => v + 5)}
                className="w-full py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground border border-dashed border-border hover:border-border/60 rounded-md transition-colors"
              >
                Muat lebih · {publicMessages.length - visibleCount} pesan
                tersisa
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-white">
        <div className="max-w-4xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-primary rounded-sm flex items-center justify-center shrink-0">
              <span className="text-[9px] font-bold text-primary-foreground">
                W
              </span>
            </div>
            <span className="font-medium text-foreground">WhisperBox</span>
            <span>— Terima pesan anonim dari siapa saja</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="hover:text-foreground transition-colors">
              Buat profilmu · Gratis
            </Link>
            <span>·</span>
            <span>© 2025</span>
          </div>
        </div>
      </footer>

      {/* Floating CTA bubble — only for guests */}
      {!isSignedIn && !bubbleDismissed && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-sm pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-3 bg-white border border-border rounded-full shadow-xl px-4 py-2.5 animate-in slide-in-from-bottom-4 duration-300">
            {/* Logo */}
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0">
              <span className="text-xs font-extrabold text-primary-foreground">
                W
              </span>
            </div>
            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground leading-tight truncate">
                Dapatkan link kamu sekarang
              </p>
              <p className="text-[11px] text-muted-foreground leading-none mt-0.5">
                Gratis · Tanpa kartu kredit
              </p>
            </div>
            {/* CTA */}
            <Link href="/" className="shrink-0">
              <Button
                size="sm"
                className="rounded-full text-xs h-8 px-4 gap-1.5"
              >
                Mulai →
              </Button>
            </Link>
            {/* Dismiss */}
            <button
              onClick={() => setBubbleDismissed(true)}
              className="shrink-0 w-6 h-6 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
