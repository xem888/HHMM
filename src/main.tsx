import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource-variable/inter";
import App from "./App";
import "./index.css";
import i18n from "./i18n";
import { applyTheme, useAppStore } from "./store/useAppStore";

applyTheme(useAppStore.getState().theme);
void i18n.changeLanguage(useAppStore.getState().lang);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
