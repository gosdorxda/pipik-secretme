import { useEffect, useRef, useState } from "react";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUser } from "@clerk/react";
import { AppLayout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { User, Save, Camera, Loader2, Instagram, Github, Linkedin, Facebook, Bell, Lock, Crown, Mail } from "lucide-react";
import { useUpload } from "@workspace/object-storage-web";
import { resolveAvatarUrl } from "@/lib/avatar";

import { 
  useGetMyProfile, 
  useUpdateMyProfile,
  getGetMyProfileQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

const socialUrl = z.string().max(100).nullable().optional().transform(val => val === "" ? null : val);

const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(32).regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),
  displayName: z.string().max(64).nullable().optional().transform(val => val === "" ? null : val),
  bio: z.string().max(500).nullable().optional().transform(val => val === "" ? null : val),
  avatarUrl: z.string().nullable().optional(),
  socialInstagram: socialUrl,
  socialTiktok: socialUrl,
  socialX: socialUrl,
  socialFacebook: socialUrl,
  socialGithub: socialUrl,
  socialLinkedin: socialUrl,
});

type ProfileFormValues = z.infer<typeof profileSchema>;

function AvatarUploader({
  currentAvatarUrl,
  displayName,
  username,
  onUploaded,
}: {
  currentAvatarUrl?: string | null;
  displayName?: string | null;
  username?: string | null;
  onUploaded: (objectPath: string) => void;
}) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { uploadFile, isUploading } = useUpload({
    onSuccess: (response) => {
      onUploaded(response.objectPath);
    },
    onError: () => {
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      toast({
        title: "Upload gagal",
        description: "Gagal mengupload gambar. Silakan coba lagi.",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast({
        title: "Format tidak didukung",
        description: "Pilih gambar berformat JPG, PNG, GIF, atau WebP.",
        variant: "destructive",
      });
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Ukuran file terlalu besar",
        description: "Gambar harus lebih kecil dari 5 MB.",
        variant: "destructive",
      });
      e.target.value = "";
      return;
    }

    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });

    await uploadFile(file);

    e.target.value = "";
  };

  const displayUrl = previewUrl ?? resolveAvatarUrl(currentAvatarUrl);
  const initials = (displayName || username || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-5">
      <div className="relative shrink-0">
        {displayUrl ? (
          <img
            src={displayUrl}
            alt="Avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-border shadow"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground border-2 border-border shadow">
            {initials}
          </div>
        )}
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium mb-1">{displayUrl ? "Ganti Foto" : "Upload Foto"}</p>
        <p className="text-xs text-muted-foreground mb-3">JPG, PNG, GIF atau WebP. Maks. 5 MB.</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-xs gap-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Mengupload...</>
          ) : (
            <><Camera className="w-3.5 h-3.5" /> Pilih Foto</>
          )}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}

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

export default function SettingsPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user: clerkUser } = useUser();

  const { data: profile, isLoading } = useGetMyProfile();
  const updateProfile = useUpdateMyProfile();
  
  const initRef = useRef(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      displayName: "",
      bio: "",
      avatarUrl: null,
      socialInstagram: null,
      socialTiktok: null,
      socialX: null,
      socialFacebook: null,
      socialGithub: null,
      socialLinkedin: null,
    },
  });

  const [emailNotifications, setEmailNotifications] = useState(false);
  const [savingNotif, setSavingNotif] = useState(false);
  const [allowReplyNotif, setAllowReplyNotif] = useState(true);
  const [savingReplyNotif, setSavingReplyNotif] = useState(false);

  useEffect(() => {
    if (profile && !initRef.current) {
      form.reset({
        username: profile.username || "",
        displayName: profile.displayName || "",
        bio: profile.bio || "",
        avatarUrl: profile.avatarUrl || null,
        socialInstagram: profile.socialInstagram || null,
        socialTiktok: profile.socialTiktok || null,
        socialX: profile.socialX || null,
        socialFacebook: profile.socialFacebook || null,
        socialGithub: profile.socialGithub || null,
        socialLinkedin: profile.socialLinkedin || null,
      });
      setEmailNotifications(profile.emailNotifications ?? false);
      setAllowReplyNotif(profile.allowReplyNotif ?? true);
      initRef.current = true;
    }
  }, [profile, form]);

  const handleToggleAllowReplyNotif = () => {
    const newValue = !allowReplyNotif;
    setAllowReplyNotif(newValue);
    setSavingReplyNotif(true);
    updateProfile.mutate(
      { data: { allowReplyNotif: newValue } },
      {
        onSuccess: (updated) => {
          queryClient.setQueryData(getGetMyProfileQueryKey(), updated);
          setSavingReplyNotif(false);
          toast({
            title: newValue ? "Input email diaktifkan" : "Input email dimatikan",
            description: newValue
              ? "Pengirim akan bisa isi email opsional untuk notifikasi balasan."
              : "Form email tidak akan muncul di halaman profilmu.",
          });
        },
        onError: () => {
          setAllowReplyNotif(!newValue);
          setSavingReplyNotif(false);
          toast({
            title: "Gagal",
            description: "Gagal mengubah pengaturan.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleToggleEmailNotifications = () => {
    const newValue = !emailNotifications;
    setEmailNotifications(newValue);
    setSavingNotif(true);
    updateProfile.mutate(
      { data: { emailNotifications: newValue } },
      {
        onSuccess: (updated) => {
          queryClient.setQueryData(getGetMyProfileQueryKey(), updated);
          setSavingNotif(false);
          toast({
            title: newValue ? "Notifikasi diaktifkan" : "Notifikasi dimatikan",
            description: newValue
              ? "Kamu akan menerima email setiap ada pesan baru."
              : "Notifikasi email telah dinonaktifkan.",
          });
        },
        onError: (err: any) => {
          setEmailNotifications(!newValue);
          setSavingNotif(false);
          if (err?.response?.data?.error === "upgrade_required") {
            toast({
              title: "Fitur Premium",
              description: "Notifikasi email eksklusif untuk Premium.",
              variant: "destructive",
              action: (
                <ToastAction altText="Upgrade" onClick={() => setLocation("/upgrade")}>
                  Upgrade
                </ToastAction>
              ),
            });
          } else {
            toast({
              title: "Gagal",
              description: "Gagal mengubah pengaturan notifikasi.",
              variant: "destructive",
            });
          }
        },
      }
    );
  };

  const onSubmit = (data: ProfileFormValues) => {
    const isPremium = profile?.isPremium ?? false;
    const payload = isPremium ? data : {
      username: data.username,
      displayName: data.displayName,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
    };

    updateProfile.mutate(
      { data: payload },
      {
        onSuccess: (updated) => {
          queryClient.setQueryData(getGetMyProfileQueryKey(), updated);
          toast({
            title: "Profil diperbarui",
            description: "Pengaturanmu berhasil disimpan.",
          });
        },
        onError: (err: any) => {
          if (err?.response?.data?.error === "upgrade_required") {
            toast({
              title: "Fitur Premium",
              description: "Social links dan notifikasi email eksklusif untuk Premium.",
              variant: "destructive",
              action: (
                <ToastAction altText="Upgrade" onClick={() => setLocation("/upgrade")}>
                  Upgrade
                </ToastAction>
              ),
            });
          } else {
            toast({
              title: "Gagal menyimpan",
              description: "Gagal memperbarui profil. Username mungkin sudah dipakai.",
              variant: "destructive",
            });
          }
        }
      }
    );
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </AppLayout>
    );
  }

  const isFirstSetup = !profile?.username;
  const currentAvatarUrl = form.watch("avatarUrl");

  const socialFields = [
    { name: "socialInstagram" as const, label: "Instagram", icon: <Instagram className="w-4 h-4" />, iconColor: "text-pink-500", placeholder: "username" },
    { name: "socialTiktok" as const, label: "TikTok", icon: <TiktokIcon className="w-4 h-4" />, iconColor: "text-foreground", placeholder: "username" },
    { name: "socialX" as const, label: "X (Twitter)", icon: <XIcon className="w-4 h-4" />, iconColor: "text-foreground", placeholder: "username" },
    { name: "socialFacebook" as const, label: "Facebook", icon: <Facebook className="w-4 h-4" />, iconColor: "text-blue-600", placeholder: "username or page name" },
    { name: "socialGithub" as const, label: "GitHub", icon: <Github className="w-4 h-4" />, iconColor: "text-zinc-700", placeholder: "username" },
    { name: "socialLinkedin" as const, label: "LinkedIn", icon: <Linkedin className="w-4 h-4" />, iconColor: "text-blue-700", placeholder: "username or profile slug" },
  ];

  return (
    <AppLayout>
      <div className="space-y-8">

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            {/* Combined Profile Card */}
            <Card className="overflow-hidden gap-0 py-0">

              {/* Section: Identitas Publik */}
              <div className="px-6 py-4 border-b border-border bg-primary/5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-primary/15 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Profil Publik</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Ditampilkan di halaman profilmu yang bisa diakses siapa saja.</p>
                </div>
              </div>
              <CardContent className="pt-6 pb-6 space-y-6">

                <AvatarUploader
                  currentAvatarUrl={currentAvatarUrl}
                  displayName={form.watch("displayName")}
                  username={form.watch("username")}
                  onUploaded={(objectPath) => {
                    form.setValue("avatarUrl", objectPath, { shouldDirty: true });
                    toast({ title: "Foto berhasil diupload", description: "Klik Simpan Perubahan untuk menerapkan foto baru." });
                  }}
                />

                <div className="border-t border-border" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username <span className="text-destructive">*</span></FormLabel>
                        <div className="flex items-center">
                          <span className="bg-secondary text-muted-foreground px-3 py-[7px] border border-r-0 border-input rounded-l-xs text-sm whitespace-nowrap">
                            /@
                          </span>
                          <FormControl>
                            <Input
                              placeholder="username"
                              className="rounded-l-none border-l-0"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value.toLowerCase())}
                            />
                          </FormControl>
                        </div>
                        <FormDescription>Huruf, angka, underscore. Min. 3 karakter.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Tampilan</FormLabel>
                        <FormControl>
                          <Input placeholder="Nama Kamu" value={field.value || ""} onChange={field.onChange} />
                        </FormControl>
                        <FormDescription>Tampil besar di halaman profilmu. Opsional.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tanya aku apa saja..."
                          className="resize-none h-24"
                          value={field.value || ""}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription>Pesan singkat untuk pengunjung profilmu. Maks. 500 karakter.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center gap-3 pt-2 border-t border-border">
                  <Button type="submit" disabled={updateProfile.isPending} className="gap-2">
                    {updateProfile.isPending
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan…</>
                      : <><Save className="w-4 h-4" /> Simpan Profil</>}
                  </Button>
                </div>
              </CardContent>

              {/* Section divider: Social Links */}
              <div className="border-t border-border">
                <div className="px-6 py-4 flex items-center justify-between gap-4"
                     style={{ background: "rgba(237,233,254,0.35)", borderBottom: "1px solid rgba(237,233,254,0.8)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                         style={{ background: "rgba(109,40,217,0.1)" }}>
                      <Linkedin className="w-4 h-4" style={{ color: "#6d28d9" }} />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-foreground">Social Links</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">Tampil sebagai ikon di halaman profilmu.</p>
                    </div>
                  </div>
                  {!profile?.isPremium && (
                    <Link href="/upgrade" className="shrink-0">
                      <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-amber-100 transition-colors">
                        <Lock className="w-3 h-3" /> Premium
                      </span>
                    </Link>
                  )}
                </div>

                {!profile?.isPremium && (
                  <div className="mx-6 mt-5 mb-4 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-md px-4 py-3">
                    <Crown className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-amber-800">Fitur Premium</p>
                      <p className="text-xs text-amber-700 mt-0.5">
                        Tambahkan social links ke profil publikmu.{" "}
                        <Link href="/upgrade" className="underline font-medium">Upgrade sekarang →</Link>
                      </p>
                    </div>
                  </div>
                )}

                <div className="px-6 pt-6 pb-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {socialFields.map(({ name, label, icon, iconColor, placeholder }) => (
                      <FormField
                        key={name}
                        control={form.control}
                        name={name}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1.5 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                              <span className={iconColor}>{icon}</span> {label}
                            </FormLabel>
                            <div className="flex items-center">
                              <span className="bg-secondary text-muted-foreground px-3 py-[7px] border border-r-0 border-input rounded-l-xs text-sm shrink-0">@</span>
                              <FormControl>
                                <Input
                                  placeholder={placeholder}
                                  className="rounded-l-none border-l-0"
                                  value={field.value || ""}
                                  onChange={field.onChange}
                                  disabled={!profile?.isPremium}
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-2 border-t border-border">
                    <Button type="submit" disabled={updateProfile.isPending} className="gap-2">
                      {updateProfile.isPending
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan…</>
                        : <><Save className="w-4 h-4" /> Simpan Social Links</>}
                    </Button>
                  </div>
                </div>
              </div>

            </Card>
          </form>
        </Form>

        {/* Allow Reply Notif Card — Premium only */}
        {profile?.username && (
          <div className="relative">
            {!profile?.isPremium && (
              <div className="absolute inset-0 z-10 rounded-md bg-white/85 dark:bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3 border border-border">
                <div className="w-10 h-10 rounded-md bg-amber-100 flex items-center justify-center mb-1">
                  <Crown className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold mb-1">Fitur Premium</p>
                  <p className="text-xs text-muted-foreground max-w-xs px-4">
                    Izinkan pengirim anonim meninggalkan email untuk mendapat notifikasi balasan. Eksklusif Premium.
                  </p>
                </div>
                <Link href="/upgrade">
                  <Button size="sm" className="gap-1.5 text-xs mt-1 bg-amber-500 hover:bg-amber-600 text-white border-0 shadow-none">
                    <Crown className="w-3.5 h-3.5" /> Upgrade Sekarang
                  </Button>
                </Link>
              </div>
            )}
            <Card className="overflow-hidden gap-0 py-0">
              <div className="px-6 py-4 flex items-center gap-3"
                   style={{ background: "rgba(204,251,241,0.35)", borderBottom: "1px solid rgba(20,184,166,0.18)" }}>
                <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                     style={{ background: "rgba(20,184,166,0.12)" }}>
                  <Mail className="w-4 h-4" style={{ color: "#0d9488" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-foreground">Notifikasi Balasan</h2>
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 border border-amber-200">
                      <Crown className="w-2.5 h-2.5" /> Premium
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Izinkan pengirim meninggalkan email untuk menerima notifikasi saat kamu membalas.</p>
                </div>
              </div>
              <CardContent className="py-5">
                <div className="flex items-center justify-between gap-6">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">Tampilkan input email opsional</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Jika aktif, pengirim anonim bisa isi email agar dapat notifikasi saat pesannya dibalas.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={allowReplyNotif}
                    disabled={savingReplyNotif || !profile?.isPremium}
                    onClick={handleToggleAllowReplyNotif}
                    className={[
                      "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                      allowReplyNotif ? "bg-primary" : "bg-input",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform duration-200",
                        allowReplyNotif ? "translate-x-5" : "translate-x-0",
                      ].join(" ")}
                    />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Notifications Card */}
        {profile?.username && (
          <div className="relative">
            {!profile?.isPremium && (
              <div className="absolute inset-0 z-10 rounded-md bg-white/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 border border-border">
                <div className="w-10 h-10 rounded-md bg-amber-100 flex items-center justify-center mb-1">
                  <Crown className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold mb-1">Fitur Premium</p>
                  <p className="text-xs text-muted-foreground max-w-xs px-4">
                    Notifikasi email setiap ada pesan baru. Eksklusif untuk Premium.
                  </p>
                </div>
                <Link href="/upgrade">
                  <Button size="sm" className="gap-1.5 text-xs mt-1 bg-amber-500 hover:bg-amber-600 text-white border-0 shadow-none">
                    <Crown className="w-3.5 h-3.5" /> Upgrade Sekarang
                  </Button>
                </Link>
              </div>
            )}
            <Card className="overflow-hidden gap-0 py-0">
              <div className="px-6 py-4 flex items-center justify-between gap-4"
                   style={{ background: "rgba(254,243,199,0.55)", borderBottom: "1px solid rgba(251,191,36,0.22)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                       style={{ background: "rgba(245,158,11,0.15)" }}>
                    <Bell className="w-4 h-4" style={{ color: "#d97706" }} />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">Notifikasi</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Atur kapan dan bagaimana kamu diberi tahu.</p>
                  </div>
                </div>
                {!profile?.isPremium && (
                  <Link href="/upgrade" className="shrink-0">
                    <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-amber-100 transition-colors">
                      <Lock className="w-3 h-3" /> Premium
                    </span>
                  </Link>
                )}
              </div>
              <CardContent className="py-5">
                <div className="flex items-center justify-between gap-6">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">Notifikasi email</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Terima email setiap ada pesan anonim baru.
                    </p>
                    {clerkUser?.primaryEmailAddress?.emailAddress && (
                      <p className="mt-1.5 font-mono text-xs text-foreground/60 bg-secondary rounded-md px-2 py-1 inline-block">
                        {clerkUser.primaryEmailAddress.emailAddress}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={emailNotifications}
                    disabled={savingNotif}
                    onClick={handleToggleEmailNotifications}
                    className={[
                      "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                      emailNotifications ? "bg-primary" : "bg-input",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform duration-200",
                        emailNotifications ? "translate-x-5" : "translate-x-0",
                      ].join(" ")}
                    />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
