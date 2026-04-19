import { useQuery } from "@tanstack/react-query";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

interface SiteBranding {
  logoUrl: string | null;
  faviconUrl: string | null;
  appName: string;
}

function resolveStorageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("/objects/")) return `/api/storage${path}`;
  return path || null;
}

async function fetchBranding(): Promise<SiteBranding> {
  const res = await fetch(`${API_BASE}/config`);
  if (!res.ok)
    return { logoUrl: null, faviconUrl: null, appName: "WhisperBox" };
  const data = await res.json();
  return {
    logoUrl: resolveStorageUrl(data.logoUrl as string | null) || null,
    faviconUrl: resolveStorageUrl(data.faviconUrl as string | null) || null,
    appName: (data.appName as string) || "WhisperBox",
  };
}

export function useSiteBranding() {
  return useQuery<SiteBranding>({
    queryKey: ["site-branding"],
    queryFn: fetchBranding,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
