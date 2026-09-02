# API NestJS

Resource Server NestJS responsável por validar tokens e proteger rotas.

## Responsabilidades

- **Validação JWT:** valida assinaturas diretamente no endpoint de descoberta (JWKS) da Microsoft.
- **Guard de escopos (`@Scopes`):** verifica se o token de um usuário possui `scp: "access_as_user"`.
- **Guard de roles (`@Roles`):** verifica se o token contém as App Roles injetadas, como `Admin.ReadWrite`, atendendo usuários administradores e serviços M2M.
- **On-Behalf-Of (OBO):** utiliza `@azure/msal-node` para trocar silenciosamente o token recebido do front-end por um novo token destinado a serviços de terceiros, como o Microsoft Graph, mantendo a rastreabilidade do usuário conectado.
