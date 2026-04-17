export const ACCENT_PALETTES: Record<string, {
  label: string;
  swatch: string;
  vars: Record<string, string>;
}> = {
  teal: {
    label: "Teal",
    swatch: "#86ead4",
    vars: {
      "--primary": "#86ead4",
      "--primary-hover": "#7de0cb",
      "--primary-foreground": "#1a443c",
      "--accent": "#ddf9f2",
      "--accent-foreground": "#3a9e88",
      "--ring": "#86ead4",
    },
  },
  red: {
    label: "Red",
    swatch: "#f87171",
    vars: {
      "--primary": "#f87171",
      "--primary-hover": "#ef4444",
      "--primary-foreground": "#ffffff",
      "--accent": "#fee2e2",
      "--accent-foreground": "#b91c1c",
      "--ring": "#f87171",
    },
  },
  orange: {
    label: "Orange",
    swatch: "#fb923c",
    vars: {
      "--primary": "#fb923c",
      "--primary-hover": "#f97316",
      "--primary-foreground": "#ffffff",
      "--accent": "#ffedd5",
      "--accent-foreground": "#c2410c",
      "--ring": "#fb923c",
    },
  },
  amber: {
    label: "Amber",
    swatch: "#fbbf24",
    vars: {
      "--primary": "#fbbf24",
      "--primary-hover": "#f59e0b",
      "--primary-foreground": "#1c1917",
      "--accent": "#fef3c7",
      "--accent-foreground": "#b45309",
      "--ring": "#fbbf24",
    },
  },
  green: {
    label: "Green",
    swatch: "#4ade80",
    vars: {
      "--primary": "#4ade80",
      "--primary-hover": "#22c55e",
      "--primary-foreground": "#14532d",
      "--accent": "#dcfce7",
      "--accent-foreground": "#16a34a",
      "--ring": "#4ade80",
    },
  },
  blue: {
    label: "Blue",
    swatch: "#60a5fa",
    vars: {
      "--primary": "#60a5fa",
      "--primary-hover": "#3b82f6",
      "--primary-foreground": "#ffffff",
      "--accent": "#dbeafe",
      "--accent-foreground": "#1d4ed8",
      "--ring": "#60a5fa",
    },
  },
  violet: {
    label: "Violet",
    swatch: "#a78bfa",
    vars: {
      "--primary": "#a78bfa",
      "--primary-hover": "#8b5cf6",
      "--primary-foreground": "#ffffff",
      "--accent": "#ede9fe",
      "--accent-foreground": "#6d28d9",
      "--ring": "#a78bfa",
    },
  },
  pink: {
    label: "Pink",
    swatch: "#f472b6",
    vars: {
      "--primary": "#f472b6",
      "--primary-hover": "#ec4899",
      "--primary-foreground": "#ffffff",
      "--accent": "#fce7f3",
      "--accent-foreground": "#be185d",
      "--ring": "#f472b6",
    },
  },
  neutral: {
    label: "Neutral",
    swatch: "#a1a1aa",
    vars: {
      "--primary": "#a1a1aa",
      "--primary-hover": "#71717a",
      "--primary-foreground": "#ffffff",
      "--accent": "#f4f4f5",
      "--accent-foreground": "#52525b",
      "--ring": "#a1a1aa",
    },
  },
};

export const FONT_OPTIONS: { id: string; label: string; family: string; googleFont?: string }[] = [
  { id: "space-grotesk", label: "Space Grotesk", family: "'Space Grotesk', sans-serif" },
  { id: "inter", label: "Inter", family: "'Inter', sans-serif", googleFont: "Inter:wght@400;500;600;700" },
  { id: "poppins", label: "Poppins", family: "'Poppins', sans-serif", googleFont: "Poppins:wght@400;500;600;700" },
  { id: "dm-sans", label: "DM Sans", family: "'DM Sans', sans-serif", googleFont: "DM+Sans:wght@400;500;600;700" },
  { id: "geist", label: "Geist", family: "'Geist', sans-serif", googleFont: "Geist:wght@400;500;600;700" },
];

export const RADIUS_OPTIONS: { id: string; label: string; value: string }[] = [
  { id: "none", label: "None", value: "0rem" },
  { id: "small", label: "Small", value: "0.125rem" },
  { id: "medium", label: "Medium", value: "0.375rem" },
  { id: "large", label: "Large", value: "0.625rem" },
  { id: "full", label: "Full", value: "1rem" },
];

const loadedFonts = new Set<string>();

export function applyTheme(accent: string, font: string, radius: string) {
  const root = document.documentElement;

  const palette = ACCENT_PALETTES[accent] ?? ACCENT_PALETTES["teal"];
  for (const [key, value] of Object.entries(palette.vars)) {
    root.style.setProperty(key, value);
  }

  const fontOpt = FONT_OPTIONS.find(f => f.id === font) ?? FONT_OPTIONS[0];
  root.style.setProperty("--font-body", fontOpt.family);
  document.body.style.fontFamily = fontOpt.family;

  if (fontOpt.googleFont && !loadedFonts.has(fontOpt.googleFont)) {
    loadedFonts.add(fontOpt.googleFont);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${fontOpt.googleFont}&display=swap`;
    document.head.appendChild(link);
  }

  const radiusOpt = RADIUS_OPTIONS.find(r => r.id === radius) ?? RADIUS_OPTIONS[1];
  root.style.setProperty("--radius", radiusOpt.value);
}
