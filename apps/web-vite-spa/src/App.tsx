import {
  useMsal,
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { useState } from "react";

export default function App() {
  const { instance, accounts } = useMsal();
  const [apiData, setApiData] = useState<any>(null);

  const loginRequest = {
    scopes: [
      `api://${import.meta.env.VITE_AZURE_API_CLIENT_ID}/access_as_user`,
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
      console.error("Falha ao buscar dados ou token expirado", error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Teste SPA (Vite + MSAL)</h1>

      <UnauthenticatedTemplate>
        <button onClick={handleLogin}>Login com Entra ID</button>
      </UnauthenticatedTemplate>

      <AuthenticatedTemplate>
        <p>Bem-vindo, {accounts[0]?.name}</p>
        <button onClick={fetchApi}>Chamar API NestJS</button>
        <button onClick={() => instance.logoutPopup()}>Sair</button>

        {apiData && (
          <pre
            style={{
              background: "#eee",
              padding: "1rem",
              marginTop: "1rem",
              color: "#000",
              textAlign: "left",
            }}
          >
            {JSON.stringify(apiData, null, 2)}
          </pre>
        )}
      </AuthenticatedTemplate>
    </div>
  );
}
