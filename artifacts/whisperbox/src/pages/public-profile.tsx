import { useParams, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Send, User, Lock, CornerDownRight, Crown, Instagram, Github, Linkedin, Facebook, Megaphone, Radio } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import {
  useGetPublicProfile,
  useSendMessage,
  useGetPublicCampaign,
} from "@workspace/api-client-react";
import { resolveAvatarUrl } from "@/lib/avatar";

const messageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty").max(1000, "Message too long"),
});

type MessageFormValues = z.infer<typeof messageSchema>;

function TiktokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.19 8.19 0 0 0 4.79 1.54V6.78a4.85 4.85 0 0 1-1.02-.09z"/>
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
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
    { key: "socialInstagram", href: (v: string) => `https://instagram.com/${v}`, icon: <Instagram className="w-3.5 h-3.5" />, label: "Instagram" },
    { key: "socialTiktok", href: (v: string) => `https://tiktok.com/@${v}`, icon: <TiktokIcon className="w-3.5 h-3.5" />, label: "TikTok" },
    { key: "socialX", href: (v: string) => `https://x.com/${v}`, icon: <XIcon className="w-3.5 h-3.5" />, label: "X" },
    { key: "socialFacebook", href: (v: string) => `https://facebook.com/${v}`, icon: <Facebook className="w-3.5 h-3.5" />, label: "Facebook" },
    { key: "socialGithub", href: (v: string) => `https://github.com/${v}`, icon: <Github className="w-3.5 h-3.5" />, label: "GitHub" },
    { key: "socialLinkedin", href: (v: string) => `https://linkedin.com/in/${v}`, icon: <Linkedin className="w-3.5 h-3.5" />, label: "LinkedIn" },
  ];

  const active = items.filter(item => !!(links as Record<string, unknown>)[item.key]);
  if (active.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {active.map(item => {
        const value = (links as Record<string, string>)[item.key];
        return (
          <a
            key={item.key}
            href={item.href(value)}
            target="_blank"
            rel="noopener noreferrer"
            title={item.label}
            className="w-8 h-8 rounded-md bg-accent/60 hover:bg-accent border border-primary/20 hover:border-primary/40 flex items-center justify-center text-accent-foreground hover:text-accent-foreground transition-all duration-150"
          >
            {item.icon}
          </a>
        );
      })}
    </div>
  );
}

export default function PublicProfilePage() {
  const params = useParams<{ username: string }>();
  const username = params.username!;
  const { toast } = useToast();

  const { data: profile, isLoading, isError } = useGetPublicProfile(username);
  const sendMessage = useSendMessage();
  const { data: activeCampaign } = useGetPublicCampaign(username);

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: "" },
  });

  const onSubmit = (data: MessageFormValues) => {
    sendMessage.mutate(
      { username, data },
      {
        onSuccess: () => {
          form.reset();
          toast({
            title: "Pesan terkirim!",
            description: "Pesan anonym kamu berhasil dikirim.",
          });
        },
        onError: (err: unknown) => {
          const apiErr = err as { status?: number; data?: { retryAfterMinutes?: number; error?: string } };
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
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-background text-foreground flex flex-col">
        <div className="border-b border-border bg-white py-3">
          <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <div className="w-5 h-5 bg-primary rounded-md flex items-center justify-center text-primary-foreground text-xs font-bold">W</div>
              WhisperBox
            </div>
          </div>
        </div>
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
        <div className="border-b border-border bg-white py-3">
          <div className="max-w-4xl mx-auto px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold text-sm text-foreground">
              <div className="w-5 h-5 bg-primary rounded-md flex items-center justify-center text-primary-foreground text-xs font-bold">W</div>
              WhisperBox
            </Link>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="border border-border bg-white p-12 shadow-sm text-center max-w-sm w-full rounded-md">
            <User className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-xl font-bold mb-2">User Not Found</h1>
            <p className="text-muted-foreground text-sm mb-8">The user '{username}' does not exist.</p>
            <Link href="/"><Button variant="outline" className="w-full">Return Home</Button></Link>
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
      <div className="border-b border-border bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold text-sm text-foreground">
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center text-primary-foreground text-xs font-bold">
              W
            </div>
            WhisperBox
          </Link>
          <Link href="/">
            <Button size="sm" variant="outline" className="text-xs">
              Get your own link
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto px-6 py-8 w-full space-y-6">

        {/* Profile Hero — no card, centered */}
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          {/* Avatar */}
          <div className="shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
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
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-2xl font-bold leading-tight text-foreground">{displayName}</h1>
                {profile.isPremium && (
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-md shrink-0">
                    <Crown className="w-3 h-3" /> Premium
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">@{profile.username}</p>
            </div>
            {profile.bio && (
              <p className="text-sm text-foreground/70 leading-relaxed max-w-sm mx-auto">{profile.bio}</p>
            )}
            <SocialLinkBar links={profile} />
          </div>
        </div>

        {/* Divider with accent */}
        <div className="relative">
          <div className="h-px bg-border" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </div>

        {/* Active Campaign Banner */}
        {activeCampaign != null && (
          <div className="rounded-md overflow-hidden shadow-sm"
               style={{ background: "linear-gradient(135deg, #f0fdf9 0%, #ecfdf5 100%)", border: "1px solid rgba(134,234,212,0.5)" }}>
            <div className="h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/60" />
            <div className="px-5 py-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center">
                  <Megaphone className="w-3 h-3 text-primary" />
                </div>
                <span className="text-[13px] font-bold text-primary uppercase tracking-wider">{activeCampaign.title}</span>
                <span className="inline-flex items-center gap-1 text-[13px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-1.5 py-0.5 rounded-md ml-auto">
                  <Radio className="w-2.5 h-2.5" /> Live
                </span>
              </div>
              <p className="text-base font-bold text-foreground leading-snug">{activeCampaign.question}</p>
              <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" /> Jawab secara anonim lewat form di bawah
              </p>
            </div>
          </div>
        )}

        {/* Send Message Card */}
        <div className="bg-white border border-border rounded-md shadow-sm overflow-hidden">
          {/* Mint accent top stripe */}
          <div className="h-1 bg-gradient-to-r from-primary/80 via-primary to-primary/60" />
          <div className="px-6 py-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Send {profile.displayName || `@${profile.username}`} a message
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">They won't know it's you</p>
              </div>
              <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-accent-foreground bg-accent border border-green-100 px-2.5 py-1 rounded-md shrink-0">
                <Lock className="w-3 h-3" /> Anonymous
              </span>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Write your anonymous message here..."
                          className="resize-none min-h-[120px] text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Lock className="w-3 h-3" /> We never store sender info
                  </p>
                  <Button
                    type="submit"
                    className="shrink-0 gap-2"
                    disabled={sendMessage.isPending || !form.watch("content").trim()}
                  >
                    {sendMessage.isPending ? "Sending..." : (
                      <><Send className="w-3.5 h-3.5" /> Send Anonymously</>
                    )}
                  </Button>
                </div>
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
              <span className="bg-primary text-primary-foreground text-[13px] font-bold px-2 py-0.5 rounded-md">
                {publicMessages.length}
              </span>
            </div>
            {publicMessages.map((msg, idx) => {
              const palette = [
                { stripe: "linear-gradient(to right, #86ead4, #60c4ae)", bg: "rgba(134,234,212,0.10)", border: "rgba(134,234,212,0.35)" },
                { stripe: "linear-gradient(to right, #86ead4, #818cf8)", bg: "rgba(165,180,252,0.10)", border: "rgba(165,180,252,0.35)" },
                { stripe: "linear-gradient(to right, #93c5fd, #6ee7b7)", bg: "rgba(147,197,253,0.10)", border: "rgba(147,197,253,0.35)" },
                { stripe: "linear-gradient(to right, #fcd34d, #86ead4)", bg: "rgba(252,211,77,0.10)", border: "rgba(252,211,77,0.35)" },
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

                {/* Header: icon + Anonymous + timestamp in one row */}
                <div className="px-4 pt-3 pb-2 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/70 border border-white flex items-center justify-center shrink-0 shadow-sm">
                    <User className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <span className="text-xs font-semibold text-foreground/70">Anonymous</span>
                  <span className="text-[13px] text-muted-foreground ml-auto">
                    {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                  </span>
                </div>

                {/* Message body */}
                <div className="px-4 pb-4">
                  <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>

                {msg.ownerReply && (
                  <div className="mx-4 mb-4 border border-primary/20 bg-white/60 rounded-md p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <span className="text-[9px] font-bold text-primary-foreground">{initials}</span>
                      </div>
                      <span className="text-xs font-semibold text-accent-foreground">{displayName}</span>
                      <CornerDownRight className="w-3 h-3 text-muted-foreground" />
                      {msg.ownerRepliedAt && (
                        <span className="text-[13px] text-muted-foreground ml-auto">
                          {formatDistanceToNow(new Date(msg.ownerRepliedAt), { addSuffix: true })}
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
          </div>
        )}
      </div>
    </div>
  );
}
