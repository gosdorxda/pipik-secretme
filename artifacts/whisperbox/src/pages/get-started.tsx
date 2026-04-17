import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useGetMyProfile } from "@workspace/api-client-react";
import { Copy, Check, Share2, LayoutDashboard, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function GetStartedPage() {
  const { data: profile, isLoading } = useGetMyProfile();
  const [, setLocation] = useLocation();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isLoading && !profile?.hasSetUsername) {
      setLocation("/settings");
    }
  }, [isLoading, profile, setLocation]);

  const username = profile?.username ?? "";
  const publicLink = `${window.location.origin}${basePath}/u/${username}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = publicLink;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "WhisperBox — Kirim pesan anon ke aku!",
          text: "Kirim pesan jujur ke aku secara anonim lewat WhisperBox 👇",
          url: publicLink,
        });
      } catch {
      }
    } else {
      handleCopy();
    }
  };

  if (isLoading || (!isLoading && !profile?.hasSetUsername)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-12 w-80 mb-4" />
        <Skeleton className="h-10 w-48" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f9fafb" }}>
      {/* Hero */}
      <div
        className="relative overflow-hidden flex flex-col items-center justify-center px-6 py-16 text-center"
        style={{ background: "linear-gradient(135deg, #0f2e28 0%, #1a443c 60%, #215c52 100%)" }}
      >
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
            Username berhasil disimpan!
          </span>

          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
            Link anonimmu<br />
            <span style={{ color: "#86ead4" }}>sudah siap! 🎉</span>
          </h1>

          <p className="text-[#a7f3e4] text-base leading-relaxed max-w-sm">
            Bagikan link ini ke bio Instagram, Twitter, TikTok, atau mana saja — dan mulai terima pesan jujur dari siapa pun.
          </p>
        </div>
      </div>

      {/* Link preview & actions */}
      <div className="flex-1 flex flex-col items-center px-6 py-10">
        <div className="w-full max-w-lg">

          {/* Link card */}
          <div
            className="bg-white rounded-xs shadow-sm mb-6 overflow-hidden"
            style={{ border: "1px solid #e4e4e7" }}
          >
            <div
              className="px-4 py-2 text-xs font-semibold uppercase tracking-widest"
              style={{ background: "#f4f4f5", color: "#71717a", borderBottom: "1px solid #e4e4e7" }}
            >
              Link profil anonimmu
            </div>
            <div className="flex items-center gap-3 px-4 py-4">
              <span
                className="flex-1 font-mono text-sm text-foreground break-all"
                style={{ wordBreak: "break-all" }}
              >
                {publicLink}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xs transition-colors"
                style={{
                  background: copied ? "#dcfce7" : "#f4f4f5",
                  color: copied ? "#15803d" : "#09090b",
                  border: copied ? "1px solid #86efac" : "1px solid #e4e4e7",
                }}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Tersalin!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Salin
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleShare}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xs transition-colors shadow-sm"
              style={{ background: "#86ead4", color: "#1a443c" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#7de0cb")}
              onMouseLeave={e => (e.currentTarget.style.background = "#86ead4")}
            >
              <Share2 className="w-4 h-4" />
              Bagikan Sekarang
            </button>

            <Link href="/dashboard">
              <button
                type="button"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xs transition-colors"
                style={{
                  background: "white",
                  color: "#1a443c",
                  border: "1px solid #e4e4e7",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f4f4f5")}
                onMouseLeave={e => (e.currentTarget.style.background = "white")}
              >
                <LayoutDashboard className="w-4 h-4" />
                Ke Dashboard
              </button>
            </Link>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-5">
            Link ini bisa kamu salin kapan saja dari halaman Dashboard atau Settings.
          </p>
        </div>
      </div>
    </div>
  );
}
