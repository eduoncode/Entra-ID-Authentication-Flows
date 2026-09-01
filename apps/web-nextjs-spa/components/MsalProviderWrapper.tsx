"use client";

import { useEffect, useState } from "react";
import { MsalProvider } from "@azure/msal-react";
import { broadcastResponseToMainFrame } from "@azure/msal-browser/redirect-bridge";
import { msalInstance, initializeMsal } from "../config/msalConfig";

export default function MsalProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthResponsePage, setIsAuthResponsePage] = useState(false);

  useEffect(() => {
    const hasAuthResponse =
      window.location.hash.includes("state=") ||
      window.location.search.includes("state=");
    setIsAuthResponsePage(hasAuthResponse);

    if (hasAuthResponse) {
      broadcastResponseToMainFrame().catch(console.error);
      return;
    }

    initializeMsal()
      .then(() => setIsInitialized(true))
      .catch(console.error);
  }, []);

  if (isAuthResponsePage)
    return <div className="p-8 text-center">Processando autenticação...</div>;

  if (!isInitialized) return null;

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}
