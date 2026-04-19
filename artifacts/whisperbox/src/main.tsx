import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

function removeLoader() {
  const loader = document.getElementById("app-loader");
  if (!loader) return;
  loader.classList.add("fade-out");
  setTimeout(() => loader.remove(), 350);
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    removeLoader();
  });
});
