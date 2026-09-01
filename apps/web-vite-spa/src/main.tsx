import React from "react";
import ReactDOM from "react-dom/client";
import { MsalProvider } from "@azure/msal-react";
import { broadcastResponseToMainFrame } from "@azure/msal-browser/redirect-bridge";
import { msalInstance } from "./authConfig";
import App from "./App";
import "./index.css";

function renderApp() {
  msalInstance.initialize().then(() => {
    ReactDOM.createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
        <MsalProvider instance={msalInstance}>
          <App />
        </MsalProvider>
      </React.StrictMode>,
    );
  });
}

// window.opener/window.parent não são confiáveis: o COOP do login.microsoftonline.com
// os zera após o redirect, então detectamos a página de resposta pelo próprio hash/query.
const hasAuthResponse =
  window.location.hash.includes("state=") ||
  window.location.search.includes("state=");

if (hasAuthResponse) {
  broadcastResponseToMainFrame().catch(() => renderApp());
} else {
  renderApp();
}
