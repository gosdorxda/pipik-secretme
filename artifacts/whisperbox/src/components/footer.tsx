import { Link } from "wouter";
import { Twitter, Instagram, Github, Mail } from "lucide-react";

const FOOTER_LINKS = {
  produk: [
    { label: "Tentang", href: "/tentang" },
    { label: "Upgrade Premium", href: "/upgrade" },
    { label: "Daftar Gratis", href: "/sign-up" },
  ],
  bantuan: [
    { label: "Cara Pakai", href: "/cara-pakai" },
    { label: "FAQ", href: "/faq" },
    { label: "Hubungi Kami", href: "mailto:hello@whisperbox.id" },
  ],
  legal: [
    { label: "Kebijakan Privasi", href: "/privasi" },
    { label: "Syarat & Ketentuan", href: "/ketentuan" },
  ],
};

const SOCIAL_LINKS = [
  { label: "Twitter / X", href: "https://x.com/whisperboxid", icon: Twitter },
  {
    label: "Instagram",
    href: "https://instagram.com/whisperboxid",
    icon: Instagram,
  },
  { label: "GitHub", href: "https://github.com/whisperboxid", icon: Github },
  { label: "Email", href: "mailto:hello@whisperbox.id", icon: Mail },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img
                src="/logo.svg"
                alt="vooi"
                className="w-7 h-7"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="font-bold text-sm text-foreground tracking-tight">
                vooi<span className="text-accent-foreground">.lol</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              Platform pesan anonim yang aman dan personal. Terima jujur tanpa
              rasa takut.
            </p>
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-7 h-7 rounded-md border border-border bg-secondary/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
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
            &copy; {new Date().getFullYear()} WhisperBox. Dibuat dengan ❤️ di
            Indonesia.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Semua sistem berjalan normal
          </div>
        </div>
      </div>
    </footer>
  );
}
