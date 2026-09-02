# Web Next.js Híbrido

Aplicação Web segura renderizada no servidor, atuando como Backend for Frontend (BFF).

## Responsabilidades

- **Auth.js v5:** centraliza a configuração de provedores. O `client_secret` nunca é exposto ao navegador.
- **Refresh Token Rotation:** intercepta o callback `jwt()` para renovar tokens expirados automaticamente. Utiliza o escopo `offline_access` e reconstrói o `URLSearchParams` com o escopo da API customizada para evitar o erro `AADSTS70000`.
- **Server Components:** injeta o token diretamente nas chamadas `fetch` feitas no backend (BFF), reduzindo a exposição da aplicação a ataques XSS.
