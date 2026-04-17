import React from "react";
import { Link, useLocation } from "wouter";
import { useClerk } from "@clerk/react";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, Inbox, Crown, Star } from "lucide-react";
import { useGetMyProfile } from "@workspace/api-client-react";
import { Footer } from "./footer";
import { AppBanner } from "./app-banner";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { signOut } = useClerk();
  const { data: profile } = useGetMyProfile();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <AppBanner />
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-sm text-foreground">
            <div className="w-7 h-7 bg-primary rounded-xs flex items-center justify-center text-primary-foreground text-xs font-bold">
              W
            </div>
            WhisperBox
          </Link>

          <nav className="flex items-center gap-1">
            <Link href="/dashboard">
              <Button
                variant={location === "/dashboard" ? "secondary" : "ghost"}
                size="sm"
                className="hidden md:flex gap-1.5"
              >
                <Inbox className="w-3.5 h-3.5" />
                Inbox
              </Button>
            </Link>
            <Link href="/settings">
              <Button
                variant={location === "/settings" ? "secondary" : "ghost"}
                size="sm"
                className="hidden md:flex gap-1.5"
              >
                <Settings className="w-3.5 h-3.5" />
                Settings
              </Button>
            </Link>
            <Link href="/referral">
              <Button
                variant={location === "/referral" ? "secondary" : "ghost"}
                size="sm"
                className="hidden md:flex gap-1.5"
              >
                <Star className="w-3.5 h-3.5" />
                Poin
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden" asChild>
              <Link href="/dashboard">
                <Inbox className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" asChild>
              <Link href="/settings">
                <Settings className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" asChild>
              <Link href="/referral">
                <Star className="w-4 h-4" />
              </Link>
            </Button>

            {profile !== undefined && (
              profile?.isPremium ? (
                <span className="hidden md:inline-flex items-center gap-1 bg-amber-100 text-amber-700 border border-amber-200 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-xs">
                  <Crown className="w-3 h-3" /> Premium
                </span>
              ) : (
                <Link href="/upgrade">
                  <Button
                    variant={location === "/upgrade" ? "secondary" : "ghost"}
                    size="sm"
                    className="gap-1.5 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Upgrade</span>
                  </Button>
                </Link>
              )
            )}

            <div className="w-px h-4 bg-border mx-2" />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ redirectUrl: "/" })}
            >
              <LogOut className="w-3.5 h-3.5 md:mr-1.5" />
              <span className="hidden md:inline">Sign Out</span>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto px-6 py-8 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
