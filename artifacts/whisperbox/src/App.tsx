import { useEffect, useRef } from "react";
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
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

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
    borderRadius: "6px",
    fontFamily: "inherit",
    fontFamilyButtons: "inherit",
    fontSize: "0.875rem",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full shadow-none",
    card: "!shadow-none !border-0 !bg-transparent !p-0",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: { color: "#09090b", fontSize: "1.375rem", fontWeight: "700" },
    headerSubtitle: { color: "#71717a", fontSize: "0.875rem" },
    socialButtonsBlockButtonText: { color: "#09090b", fontWeight: "500" },
    formFieldLabel: {
      color: "#374151",
      fontSize: "0.8125rem",
      fontWeight: "500",
    },
    footerActionLink: { color: "#1a443c", fontWeight: "600" },
    footerActionText: { color: "#71717a" },
    dividerText: { color: "#9ca3af", fontSize: "0.75rem" },
    identityPreviewEditButton: { color: "#1a443c" },
    formFieldSuccessText: { color: "#16a34a" },
    alertText: { color: "#09090b" },
    socialButtonsBlockButton:
      "border border-[#e4e4e7] hover:bg-[#f4f4f5] transition-colors rounded-md h-10",
    formButtonPrimary:
      "bg-[#86ead4] hover:bg-[#7de0cb] !text-[#1a443c] font-semibold transition-colors shadow-none h-10",
    formFieldInput:
      "border-[#e4e4e7] focus:border-[#86ead4] focus:ring-2 focus:ring-[#86ead4]/20 bg-[#f9fafb] h-10 rounded-md",
    footerAction: "bg-transparent border-t border-[#e4e4e7] mt-4",
    dividerLine: "bg-[#e4e4e7]",
    alert: "border-[#fca5a5] bg-[#fef2f2] rounded-md",
    alertIcon: "text-[#ef4444]",
    otpCodeFieldInput:
      "border-[#e4e4e7] focus:border-[#86ead4] focus:ring-2 focus:ring-[#86ead4]/20",
    logoBox: "pb-1",
    logoImage: "h-9 w-auto",
    main: "",
  },
};

const SAMPLE_MESSAGES = [
  {
    text: "Kamu itu orangnya asik banget! Selalu bikin suasana jadi lebih cair 💫",
    time: "2 mnt lalu",
    color: "#ede9fe",
    dot: "#8b5cf6",
  },
  {
    text: "Honest opinion: lo berbakat banget, jangan pernah berhenti berkarya ✨",
    time: "15 mnt lalu",
    color: "#ddf9f2",
    dot: "#86ead4",
  },
  {
    text: "Gue suka cara lo ngomong yang blak-blakan. Refreshing banget! 👏",
    time: "1 jam lalu",
    color: "#fff7ed",
    dot: "#f97316",
  },
];

function AuthLayout({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode: "sign-in" | "sign-up";
}) {
  return (
    <div className="h-screen flex overflow-hidden bg-white">
      {/* ── Left panel — branding & preview ── */}
      <div
        className="hidden lg:flex lg:w-[46%] xl:w-[48%] flex-col h-full relative overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #081a17 0%, #0f2e28 40%, #1a443c 80%, #1e5248 100%)",
        }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full opacity-[0.07]"
            style={{
              background:
                "radial-gradient(circle, #86ead4 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute -bottom-24 -right-16 w-80 h-80 rounded-full opacity-[0.07]"
            style={{
              background:
                "radial-gradient(circle, #86ead4 0%, transparent 70%)",
            }}
          />
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(#86ead4 1px, transparent 1px), linear-gradient(90deg, #86ead4 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Inner wrapper: logo top, content middle, social proof bottom */}
        <div className="relative z-10 flex flex-col h-full px-10 xl:px-12 py-8 xl:py-10">
          {/* Logo */}
          <Link href={basePath || "/"}>
            <div className="flex items-center gap-2.5 cursor-pointer group shrink-0">
              <img
                src={`${basePath}/logo.svg`}
                alt="vooi"
                className="w-8 h-8 transition-opacity group-hover:opacity-80"
              />
              <span className="text-white text-lg font-bold tracking-tight">
                vooi<span style={{ color: "#86ead4" }}>.lol</span>
              </span>
            </div>
          </Link>

          {/* Center content */}
          <div className="flex-1 flex flex-col justify-center py-6">
            {/* Headline */}
            <h1 className="text-white font-bold leading-[1.12] mb-3">
              <span className="text-[2.4rem] xl:text-[2.8rem] block">
                Pesan jujur,
              </span>
              <span
                className="text-[2.4rem] xl:text-[2.8rem] block"
                style={{ color: "#86ead4" }}
              >
                tanpa batas.
              </span>
            </h1>

            <p className="text-[#7eceba] text-sm leading-relaxed mb-5 max-w-[300px]">
              Buat profil-mu, bagikan link ke bio sosial media, dan terima pesan
              anonim jujur dari siapa saja.
            </p>

            {/* Message preview cards */}
            <div className="space-y-2 max-w-[340px]">
              <p
                className="text-[11px] font-semibold uppercase tracking-widest mb-2"
                style={{ color: "rgba(134,234,212,0.45)" }}
              >
                Contoh pesan yang kamu terima
              </p>
              {SAMPLE_MESSAGES.map((msg, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 px-3 py-2.5 rounded-lg"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0 mt-[5px]"
                    style={{ background: msg.dot }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[#d4f5ee] text-sm leading-snug">
                      {msg.text}
                    </p>
                    <p
                      className="text-[11px] mt-0.5"
                      style={{ color: "rgba(134,234,212,0.38)" }}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom social proof */}
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-lg shrink-0"
            style={{
              background: "rgba(134,234,212,0.07)",
              border: "1px solid rgba(134,234,212,0.15)",
            }}
          >
            <div className="flex -space-x-2 shrink-0">
              {[
                { l: "A", c: "#3b82f6" },
                { l: "R", c: "#f43f5e" },
                { l: "S", c: "#8b5cf6" },
                { l: "D", c: "#f59e0b" },
                { l: "M", c: "#14b8a6" },
              ].map(({ l, c }, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                  style={{ backgroundColor: c, outline: "2px solid #0f2e28" }}
                >
                  {l}
                </div>
              ))}
            </div>
            <div>
              <p className="text-white text-sm font-semibold leading-none">
                10.000+
              </p>
              <p className="text-[#7eceba] text-[11px] mt-0.5">
                pengguna aktif di seluruh Indonesia
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto bg-white">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#f0f0f0] shrink-0">
          {/* Mobile logo */}
          <Link href={basePath || "/"}>
            <div className="flex items-center gap-2 cursor-pointer lg:hidden">
              <img
                src={`${basePath}/logo.svg`}
                alt="vooi"
                className="w-7 h-7"
              />
              <span className="text-[#09090b] text-base font-bold tracking-tight">
                vooi<span className="text-[#3a9e88]">.lol</span>
              </span>
            </div>
          </Link>

          {/* Desktop back link */}
          <Link href={basePath || "/"}>
            <div className="hidden lg:flex items-center gap-1.5 text-sm text-[#71717a] hover:text-[#09090b] transition-colors cursor-pointer group">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="transition-transform group-hover:-translate-x-0.5"
              >
                <path
                  d="M10 12L6 8L10 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Kembali ke beranda
            </div>
          </Link>

          {/* Mode switcher */}
          <div className="flex items-center gap-1 text-sm text-[#71717a]">
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

        {/* Form area — flex-1 agar form tepat di tengah sisa ruang */}
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-[360px]">{children}</div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#f0f0f0] text-center shrink-0">
          <p className="text-xs text-[#9ca3af]">
            Dengan {mode === "sign-in" ? "masuk" : "mendaftar"}, kamu menyetujui{" "}
            <Link href="/ketentuan">
              <span className="underline hover:text-[#71717a] cursor-pointer transition-colors">
                Syarat & Ketentuan
              </span>
            </Link>{" "}
            dan{" "}
            <Link href="/privasi">
              <span className="underline hover:text-[#71717a] cursor-pointer transition-colors">
                Kebijakan Privasi
              </span>
            </Link>{" "}
            vooi.
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
      localization={{
        signIn: {
          start: {
            title: "Selamat datang kembali",
            subtitle: "Masuk ke akun vooi-mu",
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
