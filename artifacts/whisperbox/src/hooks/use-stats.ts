import { useQuery } from "@tanstack/react-query";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

interface PublicStats {
  totalUsers: number;
  totalMessages: number;
}

async function fetchStats(): Promise<PublicStats> {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export function usePublicStats() {
  return useQuery<PublicStats>({
    queryKey: ["public-stats"],
    queryFn: fetchStats,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
