import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("rounded-md", className)}
      style={{
        background:
          "linear-gradient(90deg, var(--muted) 25%, color-mix(in srgb, var(--muted) 40%, white) 50%, var(--muted) 75%)",
        backgroundSize: "200% 100%",
        animation: "skeleton-shimmer 1.6s ease-in-out infinite",
      }}
      {...props}
    />
  );
}

export { Skeleton };
