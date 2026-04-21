import { useSiteBranding } from "@/hooks/use-branding";

export function BannerAd({ className = "" }: { className?: string }) {
  const { data: branding } = useSiteBranding();
  const banner = branding?.bannerAd;

  if (!banner) return null;

  const inner = (
    <img
      src={banner.imageUrl}
      alt={banner.alt}
      className="w-full rounded-md object-cover block"
      style={{ maxHeight: 100 }}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.display = "none";
      }}
    />
  );

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      {banner.linkUrl ? (
        <a
          href={banner.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {inner}
        </a>
      ) : (
        inner
      )}
      <p className="text-[9px] text-muted-foreground text-right mt-0.5 pr-0.5">
        Iklan
      </p>
    </div>
  );
}
