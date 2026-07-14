import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.jsx";
import "./index.css";
import { pb } from "./lib/pb.js";

// Expose auth check for components outside the React tree
window.__pb_is_valid = () => pb.authStore.isValid;

// Use app-base meta tag if present (preview), otherwise derive from document.baseURI
const metaBase = document.querySelector('meta[name="app-base"]')?.getAttribute("content");
const basename = metaBase
  ? metaBase.replace(/\/$/, "")
  : new URL(document.baseURI).pathname.replace(/\/$/, "");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
