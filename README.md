# Entra ID Authentication Flows

Repositório central de arquitetura e implementação de fluxos modernos de autenticação utilizando o Microsoft Entra ID. O projeto oferece suporte a requisições delegadas (usuários) e M2M (máquina para máquina), conforme a documentação da Microsoft.

Construir ecossistemas corporativos exige um domínio claro sobre gestão de identidade e segurança. No entanto, sempre enfrentei o desafio real de entender quando e onde aplicar cada fluxo de autenticação do padrão OAuth 2.0, além de como implementá-los de ponta a ponta em diferentes contextos. A documentação oficial da Microsoft, embora vasta e detalhada, muitas vezes carece de exemplos práticos que conectem todas as pontas de uma arquitetura moderna.

Este repositório nasceu dessa dor técnica. Ele foi desenhado como uma arquitetura de referência para servir como um laboratório prático e um guia definitivo. O objetivo é desmistificar o Microsoft Entra ID, provando na prática como integrar Single-Page Applications, clientes híbridos (BFF), rotinas de background (M2M) e ferramentas de terminal (CLI) em um único ecossistema centralizado, escalável e seguro.

## Arquitetura do Monorepo

Este projeto utiliza Turborepo/NPM Workspaces para gerenciar os seguintes módulos:

- `apps/api-nestjs`: Resource Server (backend). Valida tokens via JWKS, aplica RBAC via roles e escopos, e realiza o fluxo On-Behalf-Of (OBO) para microsserviços/Microsoft Graph.

- `apps/web-nextjs-hybrid`: cliente híbrido (BFF). Utiliza Auth.js v5, Server Components e implementa rotação automática de refresh token.

- `apps/web-nextjs-spa`: cliente SPA. Executa o Next.js 100% no cliente com `@azure/msal-react`, gerencia pop-ups de forma segura e injeta tokens automaticamente via interceptores do Axios.

- `apps/worker-daemon`: cliente confidencial M2M. Script Node.js que consome a API em background utilizando o fluxo Client Credentials e Application Permissions.

## Provisionamento na Azure

Para executar este ecossistema completo, é necessário criar cinco registros de aplicativo distintos no portal do Azure.

### 1. API NestJS

- Acesse **App registrations** > **New registration** e use o nome `api-nestjs-backend`.

- Em **Expose an API**, clique em **Add an Application ID URI**. Será gerado um valor como `api://<UUID>`; guarde-o.

- Clique em **Add a scope** e use:
  - **Nome:** `access_as_user`
  - **Consentimento:** **Admins and users**

- Em **App roles**, crie uma role com:
  - **Display name:** `Admin.ReadWrite`
  - **Allowed member types:** **Both (Users/Groups + Applications)**
  - **Value:** `Admin.ReadWrite`

- Em **Certificates & secrets**, crie um **New client secret** e copie o **Value** para o fluxo OBO.

- Em **API permissions**, adicione **Microsoft Graph** > **Delegated permissions** > `User.Read` e conceda o **Admin consent**.

### 2. Next.js híbrido

- Crie um novo registro com o nome `web-nextjs-hybrid`.
- Em **Authentication** > **Platform configurations** > **Add a platform** > **Web**, adicione o redirect URI:
  - `http://localhost:3000/api/auth/callback/microsoft-entra-id`

- Marque os tokens de ID e de acesso apenas se precisar de **Implicit flow**. Esse fluxo não é recomendado; use **Auth Code**.

- Em **Certificates & secrets**, crie um **New client secret** e copie o **Value**.

- Em **API permissions**, clique em **Add a permission** > **My APIs** e selecione `api-nestjs-backend`.
- Escolha **Delegated permissions**, marque `access_as_user` e conceda o **Admin consent**.

### 3. Next.js SPA

- Crie um novo registro com o nome `web-nextjs-spa`.
- Em **Authentication** > **Platform configurations** > **Add a platform** > **Single-page application**, adicione o redirect URI:
  - `http://localhost:3001/` (ou a porta em que o SPA estiver sendo executado).

- **Não crie um client secret.** O fluxo PKCE nativo do SPA dispensa segredos.

### 4. Vite SPA

- Crie um novo registro com o nome `web-vite-spa`.
- Em **Authentication** > **Platform configurations** > **Add a platform** > **Single-page application**, adicione o redirect URI:
  - `http://localhost:/5173` (ou a porta em que o SPA estiver sendo executado).

- **Não crie um client secret.** O fluxo PKCE nativo do SPA dispensa segredos.

- Em **API permissions**, adicione a permissão delegada `access_as_user` da sua API e conceda o consentimento.

### 4. Worker Daemon (M2M)

- Crie um novo registro com o nome `worker-daemon`.
- Em **Certificates & secrets**, crie um **New client secret** e copie o **Value**.

- Em **API permissions**, clique em **Add a permission** > **APIs my organization uses** e cole o Client ID de `api-nestjs-backend`.

- Selecione **Application permissions** (não **Delegated**) e marque a role `Admin.ReadWrite`.

- **Obrigatório:** clique em **Grant admin consent for [Tenant]**.

### 6. CLI App (Desktop/Headless)

- Crie um novo registro com o nome cli-app.

- Em **Authentication** > **Platform configurations** > **Add a platform** > **Mobile and desktop applications**, marque a opção que contém a URI http://localhost. Isso permite que o MSAL levante um servidor web temporário em portas dinâmicas durante o fluxo interativo.

- Na tela do **Registro de aplicativo**, clique em **Authentication** > **Configurações** e ative a opção **Permitir fluxos de cliente público**

- **Não crie um client secret.** Trata-se de um cliente público.

- Em **API permissions**, clique em Add a permission > My APIs e selecione api-nestjs-backend. Marque a permissão delegada access_as_user e conceda o Admin consent.
