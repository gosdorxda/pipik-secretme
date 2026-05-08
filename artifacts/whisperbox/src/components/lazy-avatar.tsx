import { useState } from "react";
import { cn } from "@/lib/utils";

interface LazyAvatarProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}

export function LazyAvatar({
  src,
  alt,
  className,
  imgClassName,
}: LazyAvatarProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={cn(
        "relative shrink-0 rounded-full overflow-hidden",
        className,
      )}
    >
      {!loaded && (
        <div className="absolute inset-0 bg-muted overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
          imgClassName,
        )}
      />
    </div>
  );
}
