import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "wouter";
import { useGetMyProfile, useGetMyWrapped } from "@workspace/api-client-react";
import { useSiteBranding } from "@/hooks/use-branding";
import type { WrappedStats } from "@workspace/api-client-react";
import { resolveAvatarUrl } from "@/lib/avatar";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Crown,
  Share2,
  Download,
  Copy,
  RotateCcw,
  ArrowLeft,
  ImageDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toPng } from "html-to-image";

const MONTHS_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
const DAYS_ID = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

function labelHour(h: number) {
  if (h === 0) return "12 Tengah Malam";
  if (h < 12) return `${h} Pagi`;
  if (h === 12) return "12 Siang";
  if (h < 18) return `${h - 12} Sore`;
  return `${h - 12} Malam`;
}

function useCountUp(target: number, trigger: boolean, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    setValue(0);
    if (target === 0) {
      setValue(0);
      return;
    }
    const start = Date.now();
    const timer = setInterval(() => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, trigger, duration]);
  return value;
}

const W_BG = "#0f172a";
const W_CARD = "#1e293b";
const W_MINT = "#86ead4";
const W_MINT_DIM = "#3a9e88";
const W_TEXT = "#f8fafc";
const W_MUTED = "#94a3b8";

function SlideShell({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center p-8 relative animate-in fade-in slide-in-from-bottom-4 duration-500"
      style={style}
    >
      {children}
    </div>
  );
}

function PremiumLock({ isPremium }: { isPremium: boolean }) {
  if (isPremium) return null;
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center rounded-md z-10"
      style={{
        backdropFilter: "blur(12px)",
        background: "rgba(15,23,42,0.80)",
      }}
    >
      <div className="text-center px-6">
        <Crown className="w-10 h-10 mx-auto mb-3" style={{ color: W_MINT }} />
        <p className="text-lg font-bold mb-1" style={{ color: W_TEXT }}>
          Fitur Premium
        </p>
        <p className="text-sm mb-5" style={{ color: W_MUTED }}>
          Upgrade ke Premium untuk membuka sisa Wrapped-mu.
        </p>
        <Link href="/upgrade">
          <Button
            style={{ background: W_MINT, color: "#1a443c" }}
            className="font-bold"
          >
            Upgrade Sekarang
          </Button>
        </Link>
      </div>
    </div>
  );
}

function BigNumber({
  value,
  label,
  sublabel,
}: {
  value: number;
  label: string;
  sublabel?: string;
}) {
  return (
    <div className="text-center">
      <p
        className="text-sm font-semibold uppercase tracking-widest mb-4"
        style={{ color: W_MINT_DIM }}
      >
        {label}
      </p>
      <p
        className="font-bold leading-none mb-3"
        style={{ fontSize: "clamp(5rem, 20vw, 9rem)", color: W_MINT }}
      >
        {value.toLocaleString("id-ID")}
      </p>
      {sublabel && (
        <p className="text-xl font-medium" style={{ color: W_TEXT }}>
          {sublabel}
        </p>
      )}
    </div>
  );
}

type WrappedData = WrappedStats;

function Slide0Intro({
  displayName,
  year,
  month,
}: {
  displayName: string;
  year: number;
  month: number | null;
}) {
  const { data: branding } = useSiteBranding();
  const appName = branding?.appName ?? "kepoin.me";
  const period = month ? `${MONTHS_ID[month - 1]} ${year}` : `Tahun ${year}`;
  return (
    <SlideShell>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background: `radial-gradient(circle, ${W_MINT} 0%, transparent 70%)`,
          }}
        />
      </div>
      <div className="relative text-center">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-8"
          style={{
            background: `${W_MINT}20`,
            color: W_MINT,
            border: `1px solid ${W_MINT}40`,
          }}
        >
          <Sparkles className="w-3.5 h-3.5" /> {appName} Wrapped
        </div>
        <h1
          className="text-4xl md:text-6xl font-bold mb-4 leading-tight"
          style={{ color: W_TEXT }}
        >
          Halo, <span style={{ color: W_MINT }}>{displayName}!</span>
        </h1>
        <p className="text-lg mb-2" style={{ color: W_MUTED }}>
          {period} dalam sorotan ✨
        </p>
        <p className="text-sm" style={{ color: W_MUTED }}>
          Geser untuk melihat recap-mu →
        </p>
      </div>
    </SlideShell>
  );
}

function Slide1TotalMessages({
  data,
  active,
}: {
  data: WrappedData;
  active: boolean;
}) {
  const count = useCountUp(data.totalMessages, active);
  return (
    <SlideShell>
      <BigNumber value={count} label="Kamu menerima" sublabel="pesan anonim" />
      {data.totalMessages > 0 && (
        <p className="mt-6 text-sm" style={{ color: W_MUTED }}>
          Setiap pesan adalah kejujuran yang berani.
        </p>
      )}
    </SlideShell>
  );
}

function Slide2BusiestDay({
  data,
  active,
}: {
  data: WrappedData;
  active: boolean;
}) {
  const maxCount = Math.max(...data.dayDistribution.map((d) => d.count), 1);
  const peakDay = data.dayDistribution.reduce((a, b) =>
    a.count >= b.count ? a : b,
  );
  const countUp = useCountUp(peakDay.count, active);

  return (
    <SlideShell>
      <p
        className="text-sm font-semibold uppercase tracking-widest mb-6"
        style={{ color: W_MINT_DIM }}
      >
        Hari Tersibuk
      </p>
      <p
        className="text-5xl md:text-7xl font-bold mb-2"
        style={{ color: W_MINT }}
      >
        {DAYS_ID[peakDay.day]}
      </p>
      <p className="text-base mb-10" style={{ color: W_MUTED }}>
        dengan <span style={{ color: W_TEXT }}>{countUp} pesan</span>
      </p>
      <div className="w-full max-w-sm flex items-end gap-2 h-24">
        {data.dayDistribution.map(({ day, count }) => {
          const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
          const isPeak = day === peakDay.day;
          return (
            <div key={day} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-md transition-all duration-500"
                style={{
                  height: active ? `${Math.max(pct, 4)}%` : "4%",
                  background: isPeak ? W_MINT : `${W_MINT}40`,
                  transitionDelay: `${day * 80}ms`,
                }}
              />
              <p
                className="text-[10px]"
                style={{ color: isPeak ? W_MINT : W_MUTED }}
              >
                {DAYS_ID[day].slice(0, 3)}
              </p>
            </div>
          );
        })}
      </div>
    </SlideShell>
  );
}

function Slide3PeakHour({
  data,
  active,
}: {
  data: WrappedData;
  active: boolean;
}) {
  const maxCount = Math.max(...data.hourDistribution.map((h) => h.count), 1);
  const peakHour = data.hourDistribution.reduce((a, b) =>
    a.count >= b.count ? a : b,
  );
  const countUp = useCountUp(peakHour.count, active);

  const isNight = peakHour.hour >= 20 || peakHour.hour < 5;
  const emoji = isNight ? "🌙" : peakHour.hour < 12 ? "🌅" : "☀️";

  return (
    <SlideShell>
      <p
        className="text-sm font-semibold uppercase tracking-widest mb-6"
        style={{ color: W_MINT_DIM }}
      >
        Jam Tersibuk
      </p>
      <div className="text-center mb-8">
        <p className="text-7xl mb-3">{emoji}</p>
        <p
          className="text-5xl md:text-6xl font-bold mb-2"
          style={{ color: W_MINT }}
        >
          {labelHour(peakHour.hour)}
        </p>
        <p className="text-base" style={{ color: W_MUTED }}>
          rata-rata <span style={{ color: W_TEXT }}>{countUp} pesan</span>
        </p>
      </div>
      <div className="w-full max-w-sm flex items-end gap-0.5 h-16">
        {data.hourDistribution.map(({ hour, count }) => {
          const pct = (count / maxCount) * 100;
          const isPeak = hour === peakHour.hour;
          return (
            <div
              key={hour}
              className="flex-1 rounded-md transition-all duration-300"
              style={{
                height: active ? `${Math.max(pct, 4)}%` : "4%",
                background: isPeak ? W_MINT : `${W_MINT}30`,
                transitionDelay: `${hour * 25}ms`,
              }}
            />
          );
        })}
      </div>
      <div className="w-full max-w-sm flex justify-between mt-1">
        <p className="text-[10px]" style={{ color: W_MUTED }}>
          00:00
        </p>
        <p className="text-[10px]" style={{ color: W_MUTED }}>
          12:00
        </p>
        <p className="text-[10px]" style={{ color: W_MUTED }}>
          23:00
        </p>
      </div>
    </SlideShell>
  );
}

function Slide4LongestMessage({
  data,
  isPremium,
}: {
  data: WrappedData;
  isPremium: boolean;
}) {
  const msg = data.longestMessage;
  return (
    <SlideShell style={{ position: "relative" }}>
      <PremiumLock isPremium={isPremium} />
      <p
        className="text-sm font-semibold uppercase tracking-widest mb-6"
        style={{ color: W_MINT_DIM }}
      >
        Pesan Terpanjang
      </p>
      {msg ? (
        <>
          <div
            className="relative max-w-md w-full rounded-md p-6 mb-4"
            style={{ background: W_CARD, borderLeft: `3px solid ${W_MINT}` }}
          >
            <p
              className="text-base leading-relaxed italic"
              style={{ color: W_TEXT }}
            >
              "{msg.length > 200 ? msg.slice(0, 200) + "…" : msg}"
            </p>
          </div>
          <p className="text-sm" style={{ color: W_MUTED }}>
            <span style={{ color: W_MINT }}>{msg.length}</span> karakter
          </p>
        </>
      ) : (
        <p style={{ color: W_MUTED }}>Belum ada pesan di periode ini.</p>
      )}
    </SlideShell>
  );
}

function Slide5TopWords({
  data,
  isPremium,
}: {
  data: WrappedData;
  isPremium: boolean;
}) {
  const maxCount = Math.max(...data.topWords.map((w) => w.count), 1);
  const sizes = [
    "text-5xl md:text-6xl",
    "text-4xl md:text-5xl",
    "text-3xl md:text-4xl",
    "text-2xl md:text-3xl",
    "text-xl md:text-2xl",
  ];
  const opacities = [1, 0.85, 0.7, 0.6, 0.5];

  return (
    <SlideShell style={{ position: "relative" }}>
      <PremiumLock isPremium={isPremium} />
      <p
        className="text-sm font-semibold uppercase tracking-widest mb-8"
        style={{ color: W_MINT_DIM }}
      >
        Kata yang Sering Kamu Dengar
      </p>
      {data.topWords.length > 0 ? (
        <div className="flex flex-col items-center gap-3">
          {data.topWords.map((w, i) => (
            <div
              key={w.word}
              className={`font-bold ${sizes[i]} leading-none`}
              style={{ color: W_MINT, opacity: opacities[i] }}
            >
              {w.word}
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: W_MUTED }}>Belum ada cukup kata untuk dianalisis.</p>
      )}
    </SlideShell>
  );
}

function Slide6Replies({
  data,
  active,
  isPremium,
}: {
  data: WrappedData;
  active: boolean;
  isPremium: boolean;
}) {
  const countUp = useCountUp(data.repliedMessages, active);
  const pct =
    data.totalMessages > 0
      ? Math.round((data.repliedMessages / data.totalMessages) * 100)
      : 0;
  return (
    <SlideShell style={{ position: "relative" }}>
      <PremiumLock isPremium={isPremium} />
      <p
        className="text-sm font-semibold uppercase tracking-widest mb-6"
        style={{ color: W_MINT_DIM }}
      >
        Aktivitas Balasan
      </p>
      <BigNumber value={countUp} label="" sublabel="" />
      <p className="text-xl font-medium -mt-6 mb-6" style={{ color: W_TEXT }}>
        dari <span style={{ color: W_MINT }}>{data.totalMessages}</span> pesan
        yang kamu balas
      </p>
      <div
        className="w-full max-w-xs rounded-full overflow-hidden"
        style={{ height: 8, background: `${W_MINT}20` }}
      >
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: active ? `${pct}%` : "0%", background: W_MINT }}
        />
      </div>
      <p className="mt-2 text-sm" style={{ color: W_MUTED }}>
        Tingkat balasan: <span style={{ color: W_TEXT }}>{pct}%</span>
      </p>
    </SlideShell>
  );
}

function Slide7FinalCard({
  data,
  displayName,
  username,
  isPremium,
  year,
  month,
  avatarUrl,
}: {
  data: WrappedData;
  displayName: string;
  username: string;
  isPremium: boolean;
  year: number;
  month: number | null;
  avatarUrl?: string | null;
}) {
  const { data: branding } = useSiteBranding();
  const appName = branding?.appName ?? "kepoin.me";
  const period = month ? `${MONTHS_ID[month - 1]} ${year}` : `Tahun ${year}`;
  const peakDay = data.dayDistribution.reduce((a, b) =>
    a.count >= b.count ? a : b,
  );
  const peakHour = data.hourDistribution.reduce((a, b) =>
    a.count >= b.count ? a : b,
  );
  const [copied, setCopied] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<
    "idle" | "generating" | "done"
  >("idle");
  const [copyStatus, setCopyStatus] = useState<
    "idle" | "generating" | "done" | "unsupported"
  >("idle");
  const storiesCardRef = useRef<HTMLDivElement>(null);

  // Pre-fetch avatar as base64 data URL so html-to-image can inline it reliably
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | null>(null);
  useEffect(() => {
    const url = resolveAvatarUrl(avatarUrl);
    if (!url) {
      setAvatarDataUrl(null);
      return;
    }
    let cancelled = false;
    fetch(url)
      .then((r) => r.blob())
      .then(
        (blob) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          }),
      )
      .then((dataUrl) => {
        if (!cancelled) setAvatarDataUrl(dataUrl);
      })
      .catch(() => {
        if (!cancelled) setAvatarDataUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [avatarUrl]);

  const handleShare = async () => {
    const profileUrl = `${window.location.origin}/@${username}`;
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleDownloadImage = async () => {
    if (!storiesCardRef.current) return;
    setDownloadStatus("generating");
    try {
      const dataUrl = await toPng(storiesCardRef.current, {
        width: 1080,
        height: 1920,
        pixelRatio: 1,
        style: { display: "flex" },
      });
      const link = document.createElement("a");
      link.download = `${appName.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-wrapped-${year}${month ? `-${month}` : ""}.png`;
      link.href = dataUrl;
      link.click();
      setDownloadStatus("done");
      setTimeout(() => setDownloadStatus("idle"), 2500);
    } catch {
      setDownloadStatus("idle");
    }
  };

  const handleCopyImage = async () => {
    if (!storiesCardRef.current) return;
    const canWriteImage =
      typeof navigator.clipboard?.write === "function" &&
      typeof ClipboardItem !== "undefined";
    if (!canWriteImage) {
      setCopyStatus("unsupported");
      setTimeout(() => setCopyStatus("idle"), 3000);
      return;
    }
    setCopyStatus("generating");
    try {
      const dataUrl = await toPng(storiesCardRef.current, {
        width: 1080,
        height: 1920,
        pixelRatio: 1,
        style: { display: "flex" },
      });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setCopyStatus("done");
      setTimeout(() => setCopyStatus("idle"), 2500);
    } catch {
      setCopyStatus("idle");
    }
  };

  const stats = [
    { label: "Pesan Masuk", value: data.totalMessages.toLocaleString("id-ID") },
    {
      label: "Pesan Dibalas",
      value: data.repliedMessages.toLocaleString("id-ID"),
    },
    { label: "Hari Tersibuk", value: DAYS_ID[peakDay.day] },
    { label: "Jam Paling Aktif", value: labelHour(peakHour.hour) },
  ];

  return (
    <>
      <SlideShell style={{ position: "relative" }}>
        <PremiumLock isPremium={isPremium} />

        {/* Visible card preview */}
        <div
          className="max-w-sm w-full rounded-md overflow-hidden shadow-2xl"
          style={{
            background: "linear-gradient(135deg, #1e293b 0%, #0f2a1e 100%)",
            border: `1px solid ${W_MINT}30`,
          }}
        >
          <div
            className="px-6 py-5 text-center border-b"
            style={{ borderColor: `${W_MINT}20` }}
          >
            <div
              className="inline-flex items-center gap-2 text-xs font-bold mb-3"
              style={{ color: W_MINT }}
            >
              <Sparkles className="w-3.5 h-3.5" /> {appName} Wrapped
            </div>
            {resolveAvatarUrl(avatarUrl) ? (
              <img
                src={resolveAvatarUrl(avatarUrl)!}
                alt={displayName}
                crossOrigin="anonymous"
                loading="lazy"
                decoding="async"
                className="w-14 h-14 rounded-full object-cover mx-auto mb-2 ring-2"
                style={{ ringColor: `${W_MINT}60` }}
              />
            ) : (
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2 text-xl font-bold"
                style={{ background: `${W_MINT}25`, color: W_MINT }}
              >
                {(displayName || username || "?")[0].toUpperCase()}
              </div>
            )}
            <p className="text-2xl font-bold" style={{ color: W_TEXT }}>
              {displayName}
            </p>
            <p className="text-xs mt-0.5" style={{ color: W_MUTED }}>
              {period}
            </p>
          </div>
          <div
            className="grid grid-cols-2 gap-px"
            style={{ background: `${W_MINT}10` }}
          >
            {stats.map(({ label, value }) => (
              <div
                key={label}
                className="p-4 text-center"
                style={{ background: W_CARD }}
              >
                <p className="text-xl font-bold" style={{ color: W_MINT }}>
                  {value}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: W_MUTED }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 text-center">
            <p className="text-xs" style={{ color: W_MUTED }}>
              {appName} — terima kejujuran, tanpa takut.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex flex-col items-center gap-3 w-full max-w-sm">
          <div className="flex gap-2 w-full">
            <Button
              className="flex-1 gap-2"
              style={{ background: W_MINT, color: "#1a443c" }}
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
              {copied ? "Link disalin! ✓" : "Bagikan Link"}
            </Button>
          </div>

          <div className="flex gap-2 w-full">
            <Button
              className="flex-1 gap-2"
              disabled={downloadStatus === "generating"}
              onClick={handleDownloadImage}
              style={{
                background: downloadStatus === "done" ? "#22c55e" : W_CARD,
                color: downloadStatus === "done" ? "#fff" : W_TEXT,
                border: `1px solid ${W_MINT}40`,
                opacity: downloadStatus === "generating" ? 0.7 : 1,
              }}
            >
              {downloadStatus === "generating" ? (
                <>
                  <div
                    className="w-4 h-4 rounded-full border-2 animate-spin"
                    style={{
                      borderColor: `${W_MINT}40`,
                      borderTopColor: W_MINT,
                    }}
                  />
                  Membuat…
                </>
              ) : downloadStatus === "done" ? (
                <>
                  <Download className="w-4 h-4" /> Tersimpan! ✓
                </>
              ) : (
                <>
                  <ImageDown className="w-4 h-4" /> Unduh Gambar
                </>
              )}
            </Button>

            <Button
              className="flex-1 gap-2"
              disabled={copyStatus === "generating"}
              onClick={handleCopyImage}
              style={{
                background:
                  copyStatus === "done"
                    ? "#22c55e"
                    : copyStatus === "unsupported"
                      ? "#ef4444"
                      : W_CARD,
                color:
                  copyStatus === "done" || copyStatus === "unsupported"
                    ? "#fff"
                    : W_TEXT,
                border: `1px solid ${W_MINT}40`,
                opacity: copyStatus === "generating" ? 0.7 : 1,
              }}
            >
              {copyStatus === "generating" ? (
                <>
                  <div
                    className="w-4 h-4 rounded-full border-2 animate-spin"
                    style={{
                      borderColor: `${W_MINT}40`,
                      borderTopColor: W_MINT,
                    }}
                  />
                  Menyalin…
                </>
              ) : copyStatus === "done" ? (
                <>
                  <Copy className="w-4 h-4" /> Tersalin! ✓
                </>
              ) : copyStatus === "unsupported" ? (
                <>
                  <Copy className="w-4 h-4" /> Unduh saja ↑
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Salin Gambar
                </>
              )}
            </Button>
          </div>

          <p className="text-[10px] text-center" style={{ color: W_MUTED }}>
            Gambar Stories 1080×1920 siap dibagikan ke Instagram &amp; WhatsApp
          </p>
        </div>
      </SlideShell>

      {/* Hidden Stories card — mounted in document.body via portal so parent
          overflow:hidden never clips it, and avatarDataUrl (base64) is used so
          html-to-image can inline the image without extra network requests. */}
      {createPortal(
        <div
          ref={storiesCardRef}
          style={{
            position: "fixed",
            left: "-9999px",
            top: 0,
            width: 1080,
            height: 1920,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(160deg, #0f172a 0%, #0a2215 60%, #0f172a 100%)",
            fontFamily: "system-ui, -apple-system, sans-serif",
            overflow: "hidden",
          }}
        >
          {/* Glow orb */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 900,
              height: 900,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${W_MINT}18 0%, transparent 70%)`,
              pointerEvents: "none",
            }}
          />

          {/* Content */}
          <div
            style={{
              position: "relative",
              width: 840,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0,
            }}
          >
            {/* Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 28px",
                borderRadius: 999,
                background: `${W_MINT}18`,
                border: `2px solid ${W_MINT}50`,
                color: W_MINT,
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: "uppercase",
                marginBottom: 72,
              }}
            >
              ✨ {appName} Wrapped
            </div>

            {/* Avatar — use pre-fetched base64 data URL for reliable rendering */}
            {avatarDataUrl ? (
              <img
                src={avatarDataUrl}
                alt={displayName}
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginBottom: 40,
                  border: `4px solid ${W_MINT}60`,
                }}
              />
            ) : (
              <div
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: "50%",
                  background: `${W_MINT}25`,
                  color: W_MINT,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 72,
                  fontWeight: 800,
                  marginBottom: 40,
                }}
              >
                {(displayName || username || "?")[0].toUpperCase()}
              </div>
            )}

            {/* Name */}
            <p
              style={{
                fontSize: 88,
                fontWeight: 800,
                color: W_TEXT,
                margin: 0,
                lineHeight: 1.1,
                textAlign: "center",
              }}
            >
              {displayName}
            </p>
            <p
              style={{
                fontSize: 36,
                color: W_MUTED,
                margin: "16px 0 80px",
                textAlign: "center",
              }}
            >
              {period}
            </p>

            {/* Stats grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 4,
                width: "100%",
                borderRadius: 24,
                overflow: "hidden",
                background: `${W_MINT}12`,
              }}
            >
              {stats.map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    padding: "56px 32px",
                    background: W_CARD,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <p
                    style={{
                      fontSize: 60,
                      fontWeight: 800,
                      color: W_MINT,
                      margin: 0,
                      lineHeight: 1,
                    }}
                  >
                    {value}
                  </p>
                  <p style={{ fontSize: 26, color: W_MUTED, margin: 0 }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <p
              style={{
                fontSize: 28,
                color: W_MUTED,
                marginTop: 64,
                textAlign: "center",
                opacity: 0.7,
              }}
            >
              {appName} — terima kejujuran, tanpa takut.
            </p>
            <p
              style={{
                fontSize: 26,
                color: `${W_MINT}80`,
                marginTop: 12,
                textAlign: "center",
              }}
            >
              {appName}
            </p>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

const TOTAL_SLIDES = 8;

export default function WrappedPage() {
  const { data: profile } = useGetMyProfile();
  const { data: branding } = useSiteBranding();
  const appName = branding?.appName ?? "kepoin.me";
  const [phase, setPhase] = useState<"select" | "slides">("select");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState<number | null>(new Date().getMonth() + 1);
  const [slide, setSlide] = useState(0);

  const { data: wrapped, isLoading } = useGetMyWrapped({
    year,
    month: month ?? undefined,
  });

  const isPremium = profile?.isPremium ?? false;
  const username = profile?.username ?? "";
  const displayName = profile?.displayName || username || "Kamu";

  const goNext = useCallback(() => {
    setSlide((s) => Math.min(s + 1, TOTAL_SLIDES - 1));
  }, []);

  const goPrev = useCallback(() => {
    setSlide((s) => Math.max(s - 1, 0));
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev]);

  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];

  if (phase === "select") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6"
        style={{ background: W_BG }}
      >
        <Link
          href="/dashboard"
          className="absolute top-6 left-6 flex items-center gap-1.5 text-sm"
          style={{ color: W_MUTED }}
        >
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>

        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
              style={{
                background: `${W_MINT}20`,
                color: W_MINT,
                border: `1px solid ${W_MINT}40`,
              }}
            >
              <Sparkles className="w-3.5 h-3.5" /> {appName} Wrapped
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: W_TEXT }}>
              Lihat Recap-mu
            </h1>
            <p className="text-sm" style={{ color: W_MUTED }}>
              Pilih periode yang ingin kamu lihat
            </p>
          </div>

          <div
            className="rounded-md p-6 space-y-4"
            style={{ background: W_CARD }}
          >
            <div>
              <label
                className="text-xs font-semibold uppercase tracking-wider mb-2 block"
                style={{ color: W_MUTED }}
              >
                Tahun
              </label>
              <div className="grid grid-cols-3 gap-2">
                {years.map((y) => (
                  <button
                    key={y}
                    onClick={() => setYear(y)}
                    className="py-2.5 rounded-md text-sm font-semibold transition-all"
                    style={{
                      background: year === y ? W_MINT : `${W_MINT}15`,
                      color: year === y ? "#1a443c" : W_TEXT,
                      border: `1px solid ${year === y ? W_MINT : "transparent"}`,
                    }}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                className="text-xs font-semibold uppercase tracking-wider mb-2 block"
                style={{ color: W_MUTED }}
              >
                Bulan{" "}
                <span style={{ color: W_MUTED, fontWeight: "normal" }}>
                  (opsional — kosong = tahunan)
                </span>
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  onClick={() => setMonth(null)}
                  className="py-2 rounded-md text-xs font-semibold transition-all"
                  style={{
                    background: month === null ? W_MINT : `${W_MINT}15`,
                    color: month === null ? "#1a443c" : W_TEXT,
                    border: `1px solid ${month === null ? W_MINT : "transparent"}`,
                  }}
                >
                  Semua
                </button>
                {MONTHS_ID.map((name, i) => (
                  <button
                    key={i}
                    onClick={() => setMonth(i + 1)}
                    className="py-2 rounded-md text-xs font-semibold transition-all"
                    style={{
                      background: month === i + 1 ? W_MINT : `${W_MINT}15`,
                      color: month === i + 1 ? "#1a443c" : W_TEXT,
                      border: `1px solid ${month === i + 1 ? W_MINT : "transparent"}`,
                    }}
                  >
                    {name.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setSlide(0);
                setPhase("slides");
              }}
              className="w-full py-3 rounded-md font-bold text-base transition-all hover:opacity-90"
              style={{ background: W_MINT, color: "#1a443c" }}
            >
              Buka Wrapped →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: W_BG }}
      >
        <div
          className="w-10 h-10 rounded-full border-4 animate-spin"
          style={{ borderColor: `${W_MINT}40`, borderTopColor: W_MINT }}
        />
        <p className="text-sm" style={{ color: W_MUTED }}>
          Menyiapkan Wrapped-mu…
        </p>
      </div>
    );
  }

  if (!wrapped || wrapped.totalMessages === 0) {
    const period = month ? `${MONTHS_ID[month - 1]} ${year}` : `tahun ${year}`;
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-8 text-center"
        style={{ background: W_BG }}
      >
        <p className="text-5xl mb-4">💬</p>
        <h2 className="text-2xl font-bold mb-2" style={{ color: W_TEXT }}>
          Belum Ada Pesan
        </h2>
        <p className="text-sm mb-6 max-w-xs" style={{ color: W_MUTED }}>
          Kamu belum menerima pesan di {period}. Bagikan linkmu dan mulai
          kumpulkan cerita!
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setPhase("select")}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium"
            style={{ background: W_CARD, color: W_TEXT }}
          >
            <RotateCcw className="w-4 h-4" /> Ganti Periode
          </button>
          <Link href="/dashboard">
            <button
              className="px-4 py-2 rounded-md text-sm font-medium"
              style={{ background: W_MINT, color: "#1a443c" }}
            >
              Ke Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const slides = [
    <Slide0Intro
      key="intro"
      displayName={displayName}
      year={year}
      month={month}
    />,
    <Slide1TotalMessages key="total" data={wrapped} active={slide === 1} />,
    <Slide2BusiestDay key="day" data={wrapped} active={slide === 2} />,
    <Slide3PeakHour key="hour" data={wrapped} active={slide === 3} />,
    <Slide4LongestMessage key="longest" data={wrapped} isPremium={isPremium} />,
    <Slide5TopWords key="words" data={wrapped} isPremium={isPremium} />,
    <Slide6Replies
      key="replies"
      data={wrapped}
      active={slide === 6}
      isPremium={isPremium}
    />,
    <Slide7FinalCard
      key="final"
      data={wrapped}
      displayName={displayName}
      username={username}
      isPremium={isPremium}
      year={year}
      month={month}
      avatarUrl={profile?.avatarUrl}
    />,
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: W_BG, color: W_TEXT }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 shrink-0">
        <button
          onClick={() => setPhase("select")}
          className="flex items-center gap-1.5 text-sm"
          style={{ color: W_MUTED }}
        >
          <ArrowLeft className="w-4 h-4" /> Ganti Periode
        </button>
        <div
          className="flex items-center gap-1.5 text-xs font-semibold"
          style={{ color: W_MINT }}
        >
          <Sparkles className="w-3.5 h-3.5" /> Wrapped
        </div>
        <div className="text-xs" style={{ color: W_MUTED }}>
          {slide + 1} / {TOTAL_SLIDES}
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1 px-6 shrink-0">
        {slides.map((_, i) => (
          <div
            key={i}
            className="h-0.5 flex-1 rounded-full transition-all duration-300 cursor-pointer"
            style={{ background: i <= slide ? W_MINT : `${W_MINT}25` }}
            onClick={() => setSlide(i)}
          />
        ))}
      </div>

      {/* Slide area */}
      <div className="flex-1 relative overflow-hidden">
        <div key={slide} className="w-full h-full">
          {slides[slide]}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-6 py-5 shrink-0">
        <button
          onClick={goPrev}
          disabled={slide === 0}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
          style={{
            background: slide === 0 ? "transparent" : W_CARD,
            color: slide === 0 ? "transparent" : W_TEXT,
            border: `1px solid ${slide === 0 ? "transparent" : `${W_MINT}30`}`,
          }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className="rounded-full transition-all"
              style={{
                width: i === slide ? 20 : 6,
                height: 6,
                background: i === slide ? W_MINT : `${W_MINT}30`,
              }}
            />
          ))}
        </div>

        <button
          onClick={
            slide === TOTAL_SLIDES - 1 ? () => setPhase("select") : goNext
          }
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
          style={{ background: W_MINT, color: "#1a443c" }}
        >
          {slide === TOTAL_SLIDES - 1 ? (
            <RotateCcw className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
