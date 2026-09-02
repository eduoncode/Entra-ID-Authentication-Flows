import { PublicClientApplication, Configuration } from "@azure/msal-node";
import "dotenv/config";

if (!process.env.AZURE_CLIENT_ID || !process.env.AZURE_TENANT_ID) {
  console.error(
    "ERRO: Variáveis de ambiente ausentes. Verifique seu arquivo .env",
  );
  process.exit(1);
}
const msalConfig: Configuration = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
  },
};

const pca = new PublicClientApplication(msalConfig);

async function authenticate() {
  const scopes = [process.env.AZURE_API_SCOPE!];
  const useDeviceCode = process.argv.includes("--use-device-code");

  if (useDeviceCode) {
    console.log("Iniciando Autenticação via Device Code (Headless)...");
    return await pca.acquireTokenByDeviceCode({
      scopes,
      deviceCodeCallback: (response) => {
        console.log(
          "\n=========================================================",
        );
        console.log("AÇÃO REQUERIDA:");
        console.log(`1. Acesse: ${response.verificationUri}`);
        console.log(`2. Digite o código: ${response.userCode}`);
        console.log(
          "=========================================================\n",
        );
      },
    });
  } else {
    console.log("Iniciando Autenticação Interativa (Loopback Web Server)...");
    return await pca.acquireTokenInteractive({
      scopes,
      openBrowser: async (url) => {
        console.log("Abrindo navegador padrão para login...");
        const { default: openBrowserApp } = await import("open");
        await openBrowserApp(url);
      },
      successTemplate:
        "<h1>Autenticado com sucesso!</h1><p>Você pode fechar esta aba e voltar para o terminal.</p>",
      errorTemplate:
        "<h1>Erro na autenticação</h1><p>Verifique o terminal para mais detalhes.</p>",
    });
  }
}

async function runCli() {
  try {
    const authResult = await authenticate();

    if (!authResult?.accessToken) {
      throw new Error("Falha ao obter o Access Token.");
    }

    console.log(`\nOlá, ${authResult.account?.name}! Login concluído.`);
    console.log("Consultando API NestJS...\n");

    const response = await fetch(`${process.env.API_URL}/user/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authResult.accessToken}`,
      },
    });

    const data = await response.json();
    console.log("Resposta do Backend:");
    console.dir(data, { depth: null, colors: true });

    process.exit(0);
  } catch (error) {
    console.error("\nErro Fatal na CLI:", error);
    process.exit(1);
  }
}

runCli();
