import { useEffect, useRef } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk, useAuth } from "@clerk/react";
import { Switch, Route, useLocation, Router as WouterRouter, Redirect, Link } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAppConfig } from "@/hooks/use-app-config";
import { applyTheme, storeTheme } from "@/lib/theme";

import LandingPage from "@/pages/landing";
import DashboardPage from "@/pages/dashboard";
import SettingsPage from "@/pages/settings";
import UpgradePage from "@/pages/upgrade";
import WrappedPage from "@/pages/wrapped";
import ReferralPage from "@/pages/referral";
import AdminPage from "@/pages/admin";
import PublicProfilePage from "@/pages/public-profile";
import NotFound from "@/pages/not-found";

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
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "#86ead4",
    colorBackground: "#ffffff",
    colorInputBackground: "#f9fafb",
    colorText: "#09090b",
    colorTextSecondary: "#71717a",
    colorInputText: "#09090b",
    colorNeutral: "#e4e4e7",
    borderRadius: "2px",
    fontFamily: "inherit",
    fontFamilyButtons: "inherit",
    fontSize: "0.875rem",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "shadow-sm border border-[#e4e4e7] w-full overflow-hidden",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: { color: "#09090b", fontSize: "1.25rem", fontWeight: "700" },
    headerSubtitle: { color: "#71717a", fontSize: "0.875rem" },
    socialButtonsBlockButtonText: { color: "#09090b", fontWeight: "500" },
    formFieldLabel: { color: "#374151", fontSize: "0.875rem", fontWeight: "500" },
    footerActionLink: { color: "#1a443c", fontWeight: "600" },
    footerActionText: { color: "#71717a" },
    dividerText: { color: "#9ca3af" },
    identityPreviewEditButton: { color: "#1a443c" },
    formFieldSuccessText: { color: "#16a34a" },
    alertText: { color: "#09090b" },
    socialButtonsBlockButton: "border border-[#e4e4e7] hover:bg-[#f4f4f5] transition-colors",
    formButtonPrimary: "bg-[#86ead4] hover:bg-[#7de0cb] !text-[#1a443c] font-semibold transition-colors shadow-none",
    formFieldInput: "border-[#e4e4e7] focus:border-[#86ead4] focus:ring-1 focus:ring-[#86ead4] bg-[#f9fafb]",
    footerAction: "bg-[#f9fafb] border-t border-[#e4e4e7]",
    dividerLine: "bg-[#e4e4e7]",
    alert: "border-[#e4e4e7]",
    otpCodeFieldInput: "border-[#e4e4e7]",
    logoBox: "py-2",
    logoImage: "h-10 w-auto",
    main: "",
  },
};

const FEATURES = [
  { icon: "💬", text: "Terima pesan jujur dari siapa saja, tanpa mereka perlu login" },
  { icon: "🔒", text: "Identitas pengirim selalu anonim, aman, dan terlindungi" },
  { icon: "✨", text: "Bagikan link profil ke bio Instagram, Twitter, atau TikTok-mu" },
];

function AuthLayout({ children, mode }: { children: React.ReactNode; mode: "sign-in" | "sign-up" }) {
  return (
    <div className="min-h-screen flex bg-white">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] flex-col justify-between p-12 relative overflow-hidden"
           style={{ background: "linear-gradient(135deg, #0f2e28 0%, #1a443c 60%, #215c52 100%)" }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-10"
               style={{ background: "radial-gradient(circle, #86ead4, transparent)" }} />
          <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-10"
               style={{ background: "radial-gradient(circle, #86ead4, transparent)" }} />
        </div>

        <Link href={basePath || "/"}>
          <div className="flex items-center gap-3 relative z-10 cursor-pointer">
            <img src={`${basePath}/logo.svg`} alt="WhisperBox" className="w-10 h-10" />
            <span className="text-white text-xl font-bold tracking-tight">WhisperBox</span>
          </div>
        </Link>

        <div className="relative z-10">
          <p className="text-[#86ead4] text-sm font-semibold uppercase tracking-widest mb-4">
            Platform pesan anonim #1
          </p>
          <h1 className="text-white text-4xl xl:text-5xl font-bold leading-tight mb-6">
            Pesan jujur,<br />
            <span style={{ color: "#86ead4" }}>tanpa batas.</span>
          </h1>
          <p className="text-[#a7f3e4] text-lg leading-relaxed mb-10 max-w-sm">
            Buat profil unik-mu dan terima pesan anonim dari siapa saja — teman, followers, atau orang yang belum kamu kenal.
          </p>
          <div className="space-y-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-9 h-9 flex items-center justify-center shrink-0 text-base"
                     style={{ background: "rgba(134,234,212,0.15)" }}>
                  {f.icon}
                </div>
                <p className="text-[#a7f3e4] text-sm leading-relaxed pt-1">{f.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 p-4" style={{ background: "rgba(134,234,212,0.1)", border: "1px solid rgba(134,234,212,0.2)" }}>
            <div className="flex -space-x-2">
              {["A", "R", "S", "D"].map((l, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white"
                     style={{ borderColor: "#1a443c", backgroundColor: ["#3b82f6","#f43f5e","#8b5cf6","#f59e0b"][i] }}>
                  {l}
                </div>
              ))}
            </div>
            <p className="text-[#a7f3e4] text-sm">
              Bergabung dengan <span className="text-white font-semibold">10.000+</span> pengguna aktif
            </p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 bg-white">
        <div className="lg:hidden flex items-center gap-2.5 mb-8">
          <img src={`${basePath}/logo.svg`} alt="WhisperBox" className="w-8 h-8" />
          <span className="text-[#09090b] text-lg font-bold tracking-tight">WhisperBox</span>
        </div>
        <div className="w-full max-w-sm">
          {children}
        </div>
        <p className="mt-8 text-center text-xs text-[#9ca3af]">
          Dengan {mode === "sign-in" ? "masuk" : "mendaftar"}, kamu menyetujui{" "}
          <a href="#" className="underline hover:text-[#71717a]">Syarat & Ketentuan</a>{" "}
          dan{" "}
          <a href="#" className="underline hover:text-[#71717a]">Kebijakan Privasi</a> kami.
        </p>
      </div>
    </div>
  );
}

function SignInPage() {
  // To update login providers, app branding, or OAuth settings use the Auth pane in the workspace toolbar.
  return (
    <AuthLayout mode="sign-in">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </AuthLayout>
  );
}

function SignUpPage() {
  // To update login providers, app branding, or OAuth settings use the Auth pane in the workspace toolbar.
  return (
    <AuthLayout mode="sign-up">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
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
    }
  }, []);
  return null;
}

function ReferralClaimHandler() {
  const { isSignedIn, getToken } = useAuth();
  const hasFiredRef = useRef(false);

  useEffect(() => {
    if (!isSignedIn || hasFiredRef.current) return;
    const pendingRef = localStorage.getItem("wb_ref");
    if (!pendingRef) return;

    hasFiredRef.current = true;
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        await fetch(`${API_BASE}/users/me`, { headers: { Authorization: `Bearer ${token}` } });
        const res = await fetch(`${API_BASE}/referrals/claim`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ referralCode: pendingRef }),
        });
        if (res.ok) {
          localStorage.removeItem("wb_ref");
        }
      } catch {
        // silent
      }
    })();
  }, [isSignedIn, getToken]);

  return null;
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const queryClient = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
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
      localization={{
        signIn: {
          start: {
            title: "Selamat datang kembali",
            subtitle: "Masuk ke akun WhisperBox-mu",
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
          <ThemeApplier />
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

              <Route path="/u/:username" component={PublicProfilePage} />

              <Route component={NotFound} />
            </Switch>
          </div>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function ThemeApplier() {
  const { data: config, isPlaceholderData } = useAppConfig();
  useEffect(() => {
    if (config?.theme) {
      applyTheme(config.theme.accent, config.theme.font, config.theme.radius);
      if (!isPlaceholderData) {
        storeTheme(config.theme.accent, config.theme.font, config.theme.radius);
      }
    }
  }, [config?.theme?.accent, config?.theme?.font, config?.theme?.radius, isPlaceholderData]);
  return null;
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
