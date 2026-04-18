import React from "react";
import { Link, useLocation } from "wouter";
import { useClerk } from "@clerk/react";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, Inbox, Crown, Star } from "lucide-react";
import { useGetMyProfile } from "@workspace/api-client-react";
import { Footer } from "./footer";
import { AppBanner } from "./app-banner";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Inbox", icon: Inbox },
  { href: "/referral", label: "Poin", icon: Star },
  { href: "/settings", label: "Pengaturan", icon: Settings },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { signOut } = useClerk();
  const { data: profile } = useGetMyProfile();

  const displayInitial =
    profile?.displayName?.[0]?.toUpperCase() ??
    profile?.username?.[0]?.toUpperCase() ??
    "?";

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <AppBanner />
        <div className="max-w-4xl mx-auto px-5 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 font-bold text-sm text-foreground shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground text-sm font-bold shadow-sm">
              W
            </div>
            <span className="hidden sm:inline tracking-tight">WhisperBox</span>
          </Link>

          {/* Pill nav — desktop */}
          <nav className="hidden md:flex items-center gap-0.5 bg-secondary/60 border border-border rounded-full px-1 py-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <span
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-full cursor-pointer transition-all duration-150 select-none",
                    location === href
                      ? "bg-white text-foreground shadow-sm border border-border/60"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/60"
                  )}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  {label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1">

            {/* Mobile nav icons */}
            {NAV_ITEMS.map(({ href, icon: Icon }) => (
              <Link key={href} href={href}>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "md:hidden w-9 h-9",
                    location === href && "bg-secondary text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                </Button>
              </Link>
            ))}

            {/* Premium badge or upgrade button */}
            {profile !== undefined && (
              profile?.isPremium ? (
                <span className="hidden md:inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                  <Crown className="w-3 h-3" /> Premium
                </span>
              ) : (
                <Link href="/upgrade">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "gap-1.5 text-amber-600 hover:text-amber-700 hover:bg-amber-50",
                      location === "/upgrade" && "bg-amber-50 text-amber-700"
                    )}
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span className="hidden md:inline text-xs font-medium">Upgrade</span>
                  </Button>
                </Link>
              )
            )}

            <div className="w-px h-5 bg-border mx-1.5" />

            {/* Sign out */}
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-muted-foreground hover:text-foreground"
              onClick={() => signOut({ redirectUrl: "/" })}
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </Button>

            {/* User avatar */}
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shadow-sm shrink-0 ml-1">
              {displayInitial}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-8 w-full">
        {children}
      </main>

      <Footer />
    </div>
  );
}
