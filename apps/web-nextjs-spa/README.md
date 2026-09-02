# Web Next.js SPA

Aplicação com client-side rendering puro, ideal para interfaces altamente interativas.

## Responsabilidades

- **MSAL React:** orquestra o fluxo de login via pop-up.
- **Singleton de inicialização:** resolve conflitos do React Strict Mode que causam o erro `no_token_request_cache_error`, garantindo que a promessa de inicialização do MSAL ocorra apenas uma vez.
- **Prevenção de loop de iframe/pop-up:** bloqueia a renderização da árvore do React dentro das janelas de autenticação do MSAL, evitando o erro `block_nested_popups`.
- **Axios Interceptor:** automatiza `acquireTokenSilent()`. Todas as requisições HTTP de saída recebem o Bearer token atualizado sem manipulação manual de cabeçalhos nos componentes.
