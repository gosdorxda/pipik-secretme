import { Link } from "wouter";
import { Mail } from "lucide-react";
import { SiteLogoImg } from "@/components/site-logo";
import { useSiteBranding } from "@/hooks/use-branding";
import { BrandName } from "@/components/brand-name";

const CONTACT_EMAIL = "gosdorteam@gmail.com";

const FOOTER_LINKS = {
  produk: [
    { label: "Tentang", href: "/tentang" },
    { label: "Upgrade Premium", href: "/upgrade" },
    { label: "Daftar Gratis", href: "/sign-up" },
  ],
  bantuan: [
    { label: "Cara Pakai", href: "/cara-pakai" },
    { label: "FAQ", href: "/faq" },
    { label: "Hubungi Kami", href: `mailto:${CONTACT_EMAIL}` },
  ],
  legal: [
    { label: "Kebijakan Privasi", href: "/privasi" },
    { label: "Syarat & Ketentuan", href: "/ketentuan" },
  ],
};

export function Footer({ maxWidth = "max-w-5xl" }: { maxWidth?: string }) {
  const { data: branding } = useSiteBranding();
  const appName = branding?.appName ?? "vooi.lol";

  return (
    <footer className="border-t border-border bg-white">
      <div className={`${maxWidth} mx-auto px-6 py-12`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <SiteLogoImg className="w-7 h-7" alt={appName} />
              <BrandName
                name={appName}
                className="font-bold text-sm text-foreground tracking-tight"
              />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              Platform pesan anonim yang aman dan personal. Terima jujur tanpa
              rasa takut.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              aria-label="Email"
              className="w-7 h-7 rounded-md border border-border bg-secondary/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
          </div>

          <div>
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
              Produk
            </p>
            <ul className="space-y-2">
              {FOOTER_LINKS.produk.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
              Bantuan
            </p>
            <ul className="space-y-2">
              {FOOTER_LINKS.bantuan.map(({ label, href }) => (
                <li key={label}>
                  {href.startsWith("/") ? (
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {label}
                    </Link>
                  ) : (
                    <a
                      href={href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
              Legal
            </p>
            <ul className="space-y-2">
              {FOOTER_LINKS.legal.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {appName}. Dibuat dengan ❤️ di
            Indonesia.
          </p>
          <a
            href="https://linktr.ee/maskripto"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border bg-white text-xs font-medium text-foreground hover:border-foreground/30 hover:bg-secondary/30 transition-colors"
          >
            @maskripto
          </a>
        </div>
      </div>
    </footer>
  );
}
