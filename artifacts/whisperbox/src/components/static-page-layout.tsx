import { Link } from "wouter";
import { Footer } from "./footer";

interface StaticPageLayoutProps {
  children: React.ReactNode;
}

export function StaticPageLayout({ children }: StaticPageLayoutProps) {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col">
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-sm text-foreground"
          >
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center text-primary-foreground text-xs font-bold">
              W
            </div>
            WhisperBox
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/sign-up"
              className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors"
            >
              Mulai Gratis
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
