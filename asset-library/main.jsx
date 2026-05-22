import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./assets/styles/base.css";
import "./assets/styles/md.css";
import "./assets/styles/ts.css";
import "./assets/styles/cd.css";
import "./assets/styles/dfs.css";

import { applyDeckCssVars } from "./assets/md/deckTheme.js";
import { DECK_CSS_VARS } from "./assets/md/animConfig.js";

import App from "./App.jsx";
import "./asset-library.css";

applyDeckCssVars(document.documentElement, DECK_CSS_VARS);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
