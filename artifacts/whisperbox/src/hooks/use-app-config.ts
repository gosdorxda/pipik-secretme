import { useGetAppConfig } from "@workspace/api-client-react";
import type { AppConfig } from "@workspace/api-client-react";

export type { AppConfig };

const CONFIG_DEFAULTS: AppConfig = {
  premiumPrice: 49900,
  redeemRate: 10000,
  referralSignupPoints: 10,
  referralUpgradePoints: 100,
  linkOpensPointsPer1000: 1,
  notification: null,
};

export function useAppConfig() {
  return useGetAppConfig();
}
