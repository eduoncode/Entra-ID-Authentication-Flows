import { ConfidentialClientApplication, Configuration } from "@azure/msal-node";
import "dotenv/config";

const msalConfig: Configuration = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
    clientSecret: process.env.AZURE_CLIENT_SECRET!,
  },
};

const cca = new ConfidentialClientApplication(msalConfig);

async function runWorker() {
  console.log("Iniciando Worker Daemon...");

  try {
    const tokenRequest = {
      scopes: [process.env.AZURE_API_SCOPE!],
    };

    console.log("Solicitando Access Token ao Entra ID...");
    const authResult = await cca.acquireTokenByClientCredential(tokenRequest);

    if (!authResult?.accessToken) {
      throw new Error("Falha ao adquirir o token.");
    }

    console.log("Token adquirido com sucesso!");

    console.log("Executando rotina em background (chamada à API)...");

    const response = await fetch(`${process.env.API_URL}/admin/dashboard`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authResult.accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro na API:", data);
      return;
    }

    console.log("Resposta da API:", data);
  } catch (error) {
    console.error("Erro na execução do Worker:", error);
  }
}

runWorker();
