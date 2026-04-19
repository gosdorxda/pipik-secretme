import { useSiteBranding } from "@/hooks/use-branding";

const FALLBACK_LOGO = "/logo.svg";

interface SiteLogoProps {
  className?: string;
  alt?: string;
}

export function SiteLogoImg({ className, alt = "vooi" }: SiteLogoProps) {
  const { data } = useSiteBranding();
  const src = data?.logoUrl ?? FALLBACK_LOGO;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        const img = e.currentTarget as HTMLImageElement;
        if (img.src !== FALLBACK_LOGO) {
          img.src = FALLBACK_LOGO;
        }
      }}
    />
  );
}
