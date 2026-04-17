import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { getStoredTheme, applyTheme } from "./lib/theme";

const stored = getStoredTheme();
if (stored) {
  applyTheme(stored.accent, stored.font, stored.radius);
}

createRoot(document.getElementById("root")!).render(<App />);
