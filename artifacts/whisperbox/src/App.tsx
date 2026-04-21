import { useEffect, useRef } from "react";
import { removeLoader } from "@/lib/loader";
import {
  ClerkProvider,
  SignIn,
  SignUp,
  Show,
  useClerk,
  useAuth,
} from "@clerk/react";
import {
  Switch,
  Route,
  useLocation,
  Router as WouterRouter,
  Redirect,
  Link,
} from "wouter";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { useSiteBranding } from "@/hooks/use-branding";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { SiteLogoImg } from "@/components/site-logo";
import { BrandName } from "@/components/brand-name";

import LandingPage from "@/pages/landing";
import DashboardPage from "@/pages/dashboard";
import SettingsPage from "@/pages/settings";
import UpgradePage from "@/pages/upgrade";
import WrappedPage from "@/pages/wrapped";
import ReferralPage from "@/pages/referral";
import AdminPage from "@/pages/admin";
import PublicProfilePage from "@/pages/public-profile";
import NotFound from "@/pages/not-found";
import TentangPage from "@/pages/tentang";
import CaraPakaiPage from "@/pages/cara-pakai";
import FaqPage from "@/pages/faq";
import PrivasiPage from "@/pages/privasi";
import KetentuanPage from "@/pages/ketentuan";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

const queryClient = new QueryClient();

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in .env file");
}

const clerkAppearance = {
  options: {
    logoPlacement: "none" as const,
  },
  variables: {
    colorPrimary: "#86ead4",
    colorBackground: "#ffffff",
    colorInputBackground: "#f8fafc",
    colorText: "#0f172a",
    colorTextSecondary: "#64748b",
    colorInputText: "#0f172a",
    colorNeutral: "#e2e8f0",
    borderRadius: "8px",
    fontFamily: "inherit",
    fontFamilyButtons: "inherit",
    fontSize: "0.875rem",
    spacingUnit: "0.8rem",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full !shadow-none !border-0",
    card: "!shadow-none !border-0 !bg-transparent !p-0",
    footer: "!shadow-none !border-0 !bg-transparent",
    header: "!hidden",
    main: "!gap-3",
    socialButtonsBlockButton:
      "!border !border-[#e2e8f0] !bg-white hover:!bg-[#f8fafc] !shadow-sm !transition-all !duration-150 !rounded-lg !h-11 !font-medium",
    socialButtonsBlockButtonText: {
      color: "#0f172a",
      fontWeight: "600",
      fontSize: "0.875rem",
    },
    dividerRow: "!my-1",
    dividerText: { color: "#94a3b8", fontSize: "0.75rem" },
    dividerLine: "bg-[#e2e8f0]",
    formFields: "!gap-3",
    formField: "!gap-1",
    formFieldLabel: {
      color: "#374151",
      fontSize: "0.8125rem",
      fontWeight: "500",
    },
    formFieldInput:
      "!border-[#e2e8f0] focus:!border-[#86ead4] focus:!ring-2 focus:!ring-[#86ead4]/20 !bg-[#f8fafc] !h-10 !rounded-lg !text-[0.875rem]",
    formButtonPrimary:
      "!bg-[#0f2e28] hover:!bg-[#1a443c] !text-white !font-semibold !transition-all !duration-150 !shadow-none !h-10 !rounded-lg",
    footerAction: "!hidden",
    footerActionLink: { color: "#1a443c", fontWeight: "600" },
    footerActionText: { color: "#94a3b8", fontSize: "0.8125rem" },
    identityPreviewEditButton: { color: "#1a443c" },
    formFieldSuccessText: { color: "#16a34a" },
    alertText: { color: "#0f172a" },
    alert: "!border-[#fca5a5] !bg-[#fef2f2] !rounded-lg",
    alertIcon: "!text-[#ef4444]",
    otpCodeField: "!w-full !flex !flex-col !gap-2",
    otpCodeFieldInputs: "!flex !flex-row !gap-2 !justify-center !w-full",
    otpCodeFieldInput:
      "!border-[#e2e8f0] focus:!border-[#86ead4] focus:!ring-2 focus:!ring-[#86ead4]/20 !h-12 !w-12 !text-center !text-lg !rounded-lg !bg-[#f8fafc]",
    backLink: { color: "#1a443c", fontWeight: "500" },
    backLinkArrow: { color: "#1a443c" },
  },
};

function AuthLayout({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode: "sign-in" | "sign-up";
}) {
  const { data: branding } = useSiteBranding();
  const appName = branding?.appName ?? "kepoin.me";
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(135deg, #f0fdf9 0%, #fafafa 50%, #f5f3ff 100%)",
      }}
    >
      {/* Top navigation */}
      <div className="flex items-center justify-between px-6 py-4 shrink-0">
        <Link href={basePath || "/"}>
          <div className="flex items-center gap-2 cursor-pointer group">
            <SiteLogoImg className="w-7 h-7 transition-opacity group-hover:opacity-75" />
            <BrandName
              name={appName}
              className="text-[#0f172a] text-base font-bold tracking-tight"
            />
          </div>
        </Link>

        <div className="flex items-center gap-1 text-sm text-[#64748b] whitespace-nowrap">
          {mode === "sign-in" ? (
            <>
              Belum punya akun?{" "}
              <Link href={`${basePath}/sign-up`}>
                <span className="text-[#1a443c] font-semibold hover:underline cursor-pointer ml-1">
                  Daftar
                </span>
              </Link>
            </>
          ) : (
            <>
              Sudah punya akun?{" "}
              <Link href={`${basePath}/sign-in`}>
                <span className="text-[#1a443c] font-semibold hover:underline cursor-pointer ml-1">
                  Masuk
                </span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Page body — scrollable, never clips */}
      <div className="flex flex-col items-center px-4 pt-3 pb-16">
        <div className="w-full max-w-[420px]">
          {/* Brand header — above the card, outside any overflow container */}
          <div className="text-center mb-6">
            <div
              className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #86ead4 0%, #60c4ae 100%)",
                boxShadow: "0 4px 12px rgba(134,234,212,0.45)",
              }}
            >
              <SiteLogoImg className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">
              {mode === "sign-in"
                ? "Selamat datang kembali"
                : "Buat akun gratis"}
            </h1>
            <p className="text-sm text-[#64748b] mt-1.5">
              {mode === "sign-in"
                ? `Masuk ke akun ${appName.split(".")[0]}-mu`
                : "Mulai terima pesan anonim sekarang"}
            </p>
          </div>

          {/* Card — overflow:hidden here clips at our 16px radius;
               internal Clerk overflow is overridden to visible in index.css
               so only OUR card's corners clip, not internal step containers.
               No fixed height → card grows freely with Clerk content. */}
          <div
            className="w-full bg-white px-6 py-6 overflow-hidden"
            style={{
              borderRadius: 16,
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.08)",
              border: "1px solid rgba(134,234,212,0.25)",
            }}
          >
            {children}
          </div>

          {/* ToS — below the card */}
          <p className="mt-5 text-center text-[11px] text-[#94a3b8] leading-relaxed">
            Dengan {mode === "sign-in" ? "masuk" : "mendaftar"}, kamu menyetujui{" "}
            <Link href="/ketentuan">
              <span className="underline hover:text-[#64748b] cursor-pointer transition-colors">
                Syarat & Ketentuan
              </span>
            </Link>{" "}
            dan{" "}
            <Link href="/privasi">
              <span className="underline hover:text-[#64748b] cursor-pointer transition-colors">
                Kebijakan Privasi
              </span>
            </Link>{" "}
            <BrandName name={appName} />.
          </p>
        </div>
      </div>
    </div>
  );
}

function SignInPage() {
  // To update login providers, app branding, or OAuth settings use the Auth pane in the workspace toolbar.
  return (
    <AuthLayout mode="sign-in">
      <SignIn
        routing="path"
        path={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
      />
    </AuthLayout>
  );
}

function SignUpPage() {
  // To update login providers, app branding, or OAuth settings use the Auth pane in the workspace toolbar.
  return (
    <AuthLayout mode="sign-up">
      <SignUp
        routing="path"
        path={`${basePath}/sign-up`}
        signInUrl={`${basePath}/sign-in`}
      />
    </AuthLayout>
  );
}

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

function RefCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref && ref.trim().length >= 4) {
      localStorage.setItem("wb_ref", ref.trim());
      localStorage.removeItem("wb_ref_expires");
    }
  }, []);
  return null;
}

function ReferralClaimHandler() {
  const { isSignedIn, getToken } = useAuth();
  const { toast } = useToast();
  const hasFiredRef = useRef(false);

  useEffect(() => {
    if (!isSignedIn || hasFiredRef.current) return;
    const pendingRef = localStorage.getItem("wb_ref");
    if (!pendingRef) return;

    const expires = localStorage.getItem("wb_ref_expires");
    if (expires && Date.now() > parseInt(expires, 10)) {
      localStorage.removeItem("wb_ref");
      localStorage.removeItem("wb_ref_expires");
      return;
    }

    hasFiredRef.current = true;

    const attemptClaim = async (retriesLeft: number): Promise<void> => {
      try {
        const token = await getToken();
        if (!token) return;
        await fetch(`${API_BASE}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const res = await fetch(`${API_BASE}/referrals/claim`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ referralCode: pendingRef }),
        });
        if (res.ok) {
          const data = await res.json();
          localStorage.removeItem("wb_ref");
          localStorage.removeItem("wb_ref_expires");
          toast({
            title: "🎉 Referral berhasil!",
            description: `Kamu mendaftar lewat referral! +${data.pointsAwarded} poin dikreditkan ke akunmu.`,
          });
        } else if (res.status === 409) {
          localStorage.removeItem("wb_ref");
          localStorage.removeItem("wb_ref_expires");
        } else if (res.status === 404) {
          if (retriesLeft > 0) {
            const delay = (4 - retriesLeft) * 1500;
            setTimeout(() => attemptClaim(retriesLeft - 1), delay);
          } else {
            localStorage.removeItem("wb_ref");
            localStorage.removeItem("wb_ref_expires");
          }
        } else {
          if (retriesLeft > 0) {
            const delay = (4 - retriesLeft) * 1500;
            setTimeout(() => attemptClaim(retriesLeft - 1), delay);
          } else {
            localStorage.setItem(
              "wb_ref_expires",
              String(Date.now() + 24 * 60 * 60 * 1000),
            );
          }
        }
      } catch {
        if (retriesLeft > 0) {
          setTimeout(() => attemptClaim(retriesLeft - 1), 1500);
        } else {
          localStorage.setItem(
            "wb_ref_expires",
            String(Date.now() + 24 * 60 * 60 * 1000),
          );
        }
      }
    };

    attemptClaim(3);
  }, [isSignedIn, getToken, toast]);

  return null;
}

function ClerkReadySignal() {
  const { isLoaded } = useAuth();
  useEffect(() => {
    if (isLoaded) removeLoader();
  }, [isLoaded]);
  return null;
}

function FaviconUpdater() {
  const { data } = useSiteBranding();
  useEffect(() => {
    if (!data?.faviconUrl) return;
    const link =
      (document.querySelector("link[rel~='icon']") as HTMLLinkElement) ||
      document.createElement("link");
    link.rel = "icon";
    link.href = data.faviconUrl;
    document.head.appendChild(link);
  }, [data?.faviconUrl]);
  return null;
}

function GoogleAnalyticsInjector() {
  const { data } = useSiteBranding();
  const gaId = data?.googleAnalyticsId;
  useEffect(() => {
    if (!gaId) return;
    if (document.getElementById("ga-script")) return;
    const script1 = document.createElement("script");
    script1.id = "ga-script";
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script1);
    const script2 = document.createElement("script");
    script2.id = "ga-init";
    script2.text = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`;
    document.head.appendChild(script2);
  }, [gaId]);
  return null;
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const queryClient = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        queryClient.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, queryClient]);

  return null;
}

function HomeRedirect() {
  return (
    <>
      <Show when="signed-in">
        <Redirect to="/dashboard" />
      </Show>
      <Show when="signed-out">
        <LandingPage />
      </Show>
    </>
  );
}

function ProtectedRoute({ component: Component }: { component: any }) {
  return (
    <>
      <Show when="signed-in">
        <Component />
      </Show>
      <Show when="signed-out">
        <Redirect to="/" />
      </Show>
    </>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      termsPageUrl={`${basePath}/ketentuan`}
      privacyPageUrl={`${basePath}/privasi`}
      localization={{
        signIn: {
          start: {
            title: "Selamat datang kembali",
            subtitle: "Masuk ke akunmu",
          },
        },
        signUp: {
          start: {
            title: "Buat akun gratis",
            subtitle: "Mulai terima pesan anonim sekarang",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ClerkReadySignal />
          <FaviconUpdater />
          <GoogleAnalyticsInjector />
          <RefCapture />
          <ReferralClaimHandler />
          <ClerkQueryClientCacheInvalidator />
          <div>
            <Switch>
              <Route path="/" component={HomeRedirect} />
              <Route path="/sign-in/*?" component={SignInPage} />
              <Route path="/sign-up/*?" component={SignUpPage} />

              <Route path="/dashboard">
                {() => <ProtectedRoute component={DashboardPage} />}
              </Route>
              <Route path="/settings">
                {() => <ProtectedRoute component={SettingsPage} />}
              </Route>
              <Route path="/upgrade">
                {() => <ProtectedRoute component={UpgradePage} />}
              </Route>
              <Route path="/wrapped">
                {() => <ProtectedRoute component={WrappedPage} />}
              </Route>
              <Route path="/referral">
                {() => <ProtectedRoute component={ReferralPage} />}
              </Route>
              <Route path="/admin" component={AdminPage} />

              <Route path="/tentang" component={TentangPage} />
              <Route path="/cara-pakai" component={CaraPakaiPage} />
              <Route path="/faq" component={FaqPage} />
              <Route path="/privasi" component={PrivasiPage} />
              <Route path="/ketentuan" component={KetentuanPage} />

              {/* Legacy redirect: /u/username → /@username */}
              <Route path="/u/:username">
                {(params: { username?: string }) => {
                  const [, setLocation] = useLocation();
                  useEffect(() => {
                    if (params.username)
                      setLocation(`/@${params.username}`, { replace: true });
                  }, [params.username]);
                  return null;
                }}
              </Route>

              <Route path="/:handle">
                {(params: { handle?: string }) => {
                  const handle = params.handle ?? "";
                  if (!handle.startsWith("@")) return <NotFound />;
                  return <PublicProfilePage />;
                }}
              </Route>

              <Route component={NotFound} />
            </Switch>
          </div>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
