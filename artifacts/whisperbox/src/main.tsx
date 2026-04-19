import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

function removeLoader() {
  const loader = document.getElementById("app-loader");
  if (!loader) return;
  loader.classList.add("fade-out");
  setTimeout(() => loader.remove(), 350);
}

if (document.readyState === "complete") {
  setTimeout(removeLoader, 100);
} else {
  window.addEventListener("load", () => setTimeout(removeLoader, 100));
}
