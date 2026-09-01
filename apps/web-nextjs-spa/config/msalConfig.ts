import { Configuration, PublicClientApplication } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_TENANT_ID}`,
    redirectUri: typeof window !== "undefined" ? window.location.origin : "/",
    postLogoutRedirectUri:
      typeof window !== "undefined" ? window.location.origin : "/",
  },
  cache: {
    cacheLocation: "sessionStorage",
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

let msalInitPromise: Promise<any> | null = null;

export const initializeMsal = () => {
  if (!msalInitPromise) {
    const hasAuthResponse =
      typeof window !== "undefined" &&
      (window.location.hash.includes("state=") ||
        window.location.search.includes("state="));

    msalInitPromise = msalInstance.initialize().then(() => {
      if (!hasAuthResponse) return undefined;
      return msalInstance.handleRedirectPromise().catch(() => undefined);
    });
  }
  return msalInitPromise;
};
