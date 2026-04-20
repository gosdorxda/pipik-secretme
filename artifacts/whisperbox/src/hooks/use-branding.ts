import { useQuery } from "@tanstack/react-query";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

interface SiteBranding {
  logoUrl: string | null;
  faviconUrl: string | null;
  appName: string;
  contactEmail: string | null;
}

function resolveStorageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("/objects/")) return `/api/storage${path}`;
  return path || null;
}

const DEFAULT_APP_NAME = "vooi.lol";

async function fetchBranding(): Promise<SiteBranding> {
  const res = await fetch(`${API_BASE}/config`);
  if (!res.ok)
    return {
      logoUrl: null,
      faviconUrl: null,
      appName: DEFAULT_APP_NAME,
      contactEmail: null,
    };
  const data = await res.json();
  return {
    logoUrl: resolveStorageUrl(data.logoUrl as string | null) || null,
    faviconUrl: resolveStorageUrl(data.faviconUrl as string | null) || null,
    appName: (data.appName as string) || DEFAULT_APP_NAME,
    contactEmail: (data.contactEmail as string | null) || null,
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
