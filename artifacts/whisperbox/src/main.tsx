import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { removeLoader } from "./lib/loader";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

setTimeout(removeLoader, 6000);
