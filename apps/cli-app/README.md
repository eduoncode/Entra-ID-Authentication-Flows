# CLI App

Aplicação de linha de comando em Node.js demonstrando a autenticação segura de clientes públicos no Microsoft Entra ID, suportando ambientes com e sem interface gráfica.

## Responsabilidades

- **Cliente Público:** opera nativamente sem client_secret. A validação é garantida pelas configurações da plataforma no Entra ID e pela identidade do usuário.

- **Loopback Web Server:** levanta um servidor local temporário para capturar o _Authorization Code_ automaticamente após o login no navegador padrão do sistema operacional. É o fluxo ideal e mais seguro para terminais locais.

- **Device Code Flow:** estratégia headless ativada via flag `--use-device-code`. Permite a autenticação em ambientes restritos (como conexões SSH ou containers) exibindo um código curto no terminal para que o usuário aprove o login em outro dispositivo, como um smartphone.

- **Resolução ESM/CommonJS:** utiliza execução moderna via tsx e importações dinâmicas (`await import()`) para contornar gargalos do ecossistema Node.js ao instanciar bibliotecas nativas de navegador.

- **Integração de Escopo:** consome a API NestJS anexando silenciosamente o Access Token com o escopo delegado access_as_user nas requisições de saída.
