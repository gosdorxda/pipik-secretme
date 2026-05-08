// Logo is served via /api/logo which proxies the admin-configured logo URL
// (or falls back to the inline teal SVG if none is set or the external URL
// is unreachable). This means the correct logo renders on first paint without
// waiting for the branding API call to complete.

const STATIC_FALLBACK = "/logo.svg";

interface SiteLogoProps {
  className?: string;
  alt?: string;
}

export function SiteLogoImg({ className, alt = "kepoin" }: SiteLogoProps) {
  return (
    <img
      src="/api/logo"
      alt={alt}
      className={className}
      onError={(e) => {
        const img = e.currentTarget as HTMLImageElement;
        if (img.getAttribute("src") !== STATIC_FALLBACK) {
          img.src = STATIC_FALLBACK;
        }
      }}
    />
  );
}
