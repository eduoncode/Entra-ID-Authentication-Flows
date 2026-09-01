"use client";

import {
  useMsal,
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { useState } from "react";

export default function Home() {
  const { instance, accounts } = useMsal();
  const [apiData, setApiData] = useState<any>(null);

  const loginRequest = {
    scopes: [
      `api://${process.env.NEXT_PUBLIC_AZURE_API_CLIENT_ID}/access_as_user`,
    ],
  };

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch((e) => console.error(e));
  };

  const fetchApi = async () => {
    try {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });

      const res = await fetch("http://localhost:3002/user/profile", {
        headers: {
          Authorization: `Bearer ${response.accessToken}`,
        },
      });

      setApiData(await res.json());
    } catch (error) {
      console.error("Falha ao buscar dados", error);
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        Next.js SPA (Client-Side Auth)
      </h1>

      <UnauthenticatedTemplate>
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white p-2 rounded"
        >
          Login com Entra ID
        </button>
      </UnauthenticatedTemplate>

      <AuthenticatedTemplate>
        <p className="mb-4">Bem-vindo, {accounts[0]?.name}</p>
        <button
          onClick={fetchApi}
          className="bg-green-600 text-white p-2 rounded mr-2"
        >
          Chamar API NestJS
        </button>
        <button
          onClick={() => instance.logoutPopup()}
          className="bg-red-600 text-white p-2 rounded"
        >
          Sair
        </button>

        {apiData && (
          <pre className="bg-slate-100 p-4 mt-4 text-black rounded">
            {JSON.stringify(apiData, null, 2)}
          </pre>
        )}
      </AuthenticatedTemplate>
    </main>
  );
}
