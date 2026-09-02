# Worker Daemon

Cliente confidencial para rotinas de background, como CRONs, filas e integrações de sistema.

## Responsabilidades

- **Client Credentials Flow:** dispensa interação humana e troca as próprias credenciais (`Client ID` + `Secret`) por um token de acesso usando o escopo `/.default`.
- **Application Permissions:** consome a API validando-se exclusivamente através do `RolesGuard` (`Admin.ReadWrite`), sem depender de um contexto de usuário (delegação).
