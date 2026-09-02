import axios from "axios";
import { msalInstance } from "../authConfig";
export const api = axios.create({
  baseURL: "http://localhost:3002",
});

api.interceptors.request.use(
  async (config) => {
    const account = msalInstance.getAllAccounts()[0];

    if (account) {
      try {
        const response = await msalInstance.acquireTokenSilent({
          scopes: [
            `api://${import.meta.env.NEXT_PUBLIC_AZURE_API_CLIENT_ID}/access_as_user`,
          ],
          account: account,
        });

        config.headers.Authorization = `Bearer ${response.accessToken}`;
      } catch (error) {
        console.error(
          "Falha na renovação silenciosa do token. Sessão pode ter expirado:",
          error,
        );

        msalInstance.logoutRedirect();
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
