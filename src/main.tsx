import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { initCodeProtection } from "./utils/security";

// Inisialisasi proteksi source code (Anti-Inspect & Anti-Code Theft)
initCodeProtection();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
