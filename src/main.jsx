import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

import { store } from "./store/store";
import App from "./App";
import "./index.css";

// Apply dark mode before render to avoid flash
const theme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
if (theme === "dark" || (!theme && prefersDark)) {
  document.documentElement.classList.add("dark");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "var(--toast-bg, #1e293b)",
              color: "var(--toast-color, #f1f5f9)",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.08)",
              fontSize: "14px",
              fontWeight: "500",
            },
            success: {
              iconTheme: { primary: "#22c55e", secondary: "#1e293b" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#1e293b" },
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
