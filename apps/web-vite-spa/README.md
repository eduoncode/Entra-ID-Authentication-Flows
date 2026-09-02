# Web Vite SPA

Aplicação com client-side rendering utilizando React puro e Vite. Ideal para projetos clássicos de React que não utilizam SSR (Server-Side Rendering) e rodam 100% no navegador.

## Responsabilidades

- **Cliente público (PKCE):** opera sem `client_secret`. A segurança é garantida pela configuração de plataforma Single-page application no Entra ID e pelo fluxo Authorization Code com PKCE.
- **Tratamento de pop-ups e iframes:** implementa um bloqueio de renderização no `main.tsx` (`if (isIframe || isPopup)`). Isso impede que o React carregue a aplicação inteira dentro da janela de login do Entra ID, solucionando o erro `block_nested_popups` do MSAL.
- **Componentização declarativa:** utiliza os componentes `<AuthenticatedTemplate>` e `<UnauthenticatedTemplate>` do `@azure/msal-react` para orquestrar a exibição da UI sem múltiplos `useEffect` ou checagens manuais de estado.
- **Aquisição silenciosa:** demonstra o padrão base de `acquireTokenSilent()` sem interceptors automáticos, buscando o token no `sessionStorage` ou renovando-o em background via iframe invisível antes do `fetch` manual para a API NestJS.
