import { useQuery } from "@tanstack/react-query";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

export interface AppTheme {
  accent: string;
  font: string;
  radius: string;
}

export interface AppConfig {
  premiumPrice: number;
  redeemRate: number;
  referralSignupPoints: number;
  referralUpgradePoints: number;
  linkOpensPointsPer1000: number;
  notification: { message: string; type: string } | null;
  theme: AppTheme;
}

const CONFIG_DEFAULTS: AppConfig = {
  premiumPrice: 49900,
  redeemRate: 10000,
  referralSignupPoints: 10,
  referralUpgradePoints: 100,
  linkOpensPointsPer1000: 1,
  notification: null,
  theme: { accent: "teal", font: "space-grotesk", radius: "small" },
};

export function useAppConfig() {
  return useQuery<AppConfig>({
    queryKey: ["app-config"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/config`);
      if (!res.ok) throw new Error("Failed to fetch config");
      return res.json();
    },
    staleTime: 2 * 60 * 1000,
    placeholderData: CONFIG_DEFAULTS,
  });
}
