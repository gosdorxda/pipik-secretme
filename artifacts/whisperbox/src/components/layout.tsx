import React from "react";
import { Link, useLocation } from "wouter";
import { useClerk } from "@clerk/react";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, Inbox, Star } from "lucide-react";
import { useGetMyProfile } from "@workspace/api-client-react";
import { Footer } from "./footer";
import { AppBanner } from "./app-banner";
import { SiteLogoImg } from "./site-logo";
import { cn } from "@/lib/utils";
import { useSiteBranding } from "@/hooks/use-branding";
import { BrandName } from "./brand-name";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Inbox", icon: Inbox },
  { href: "/referral", label: "Poin", icon: Star },
  { href: "/settings", label: "Pengaturan", icon: Settings },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { signOut } = useClerk();
  const { data: branding } = useSiteBranding();
  const appName = branding?.appName ?? "vooi.lol";
  useGetMyProfile();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <AppBanner />
        <div className="max-w-4xl mx-auto px-5 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
            <SiteLogoImg className="w-7 h-7" />
            <BrandName
              name={appName}
              className="hidden sm:inline font-bold text-sm tracking-tight text-foreground"
            />
          </Link>

          {/* Nav + Logout — all in one group */}
          <nav className="flex items-center gap-0.5">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "gap-1.5",
                    location === href
                      ? "bg-secondary text-foreground font-semibold"
                      : "text-muted-foreground",
                  )}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden md:inline">{label}</span>
                </Button>
              </Link>
            ))}

            <div className="w-px h-4 bg-border mx-1.5" />

            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground gap-1.5"
              onClick={() => signOut({ redirectUrl: "/" })}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Keluar</span>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full">
        {children}
      </main>

      <Footer maxWidth="max-w-4xl" />
    </div>
  );
}
