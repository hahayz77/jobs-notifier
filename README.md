# Web Scraper and Notification API

Este é um projeto de API desenvolvido com Node.js para monitorar sites (especialmente sites de vagas com conteúdo dinâmico) usando web scraping. A API verifica uma lista configurável de sites e extrai informações específicas, com o objetivo de enviar notificações diárias (atualmente simuladas para o console) com os dados encontrados.

O projeto utiliza as seguintes tecnologias principais:

* **Node.js:** Ambiente de execução.
* **Express:** Framework web para a API.
* **Puppeteer:** Biblioteca para controle de navegador (para sites dinâmicos).
* **dotenv:** Para carregar variáveis de ambiente.
* **module-alias:** Para configurar aliases de módulo (imports mais limpos).

## Organização das Pastas

A estrutura básica do projeto é a seguinte:

````
.
├── src/
│   ├── api/
│   │   └── routes.js         # Rotas da API (atualmente definida em app.js)
│   ├── config/
│   │   ├── index.js          # Configurações gerais (email, porta, etc.)
│   │   └── sites.js          # Lista de sites a serem monitorados e suas configurações
│   ├── services/
│   │   └── emailService.js   # Lógica de envio de email (ou simulação)
│   ├── scrapers/
│   │   ├── index.js          # Orquestrador para diferentes métodos de scraping
│   │   └── puppeteerScraper.js # Lógica específica de scraping com Puppeteer
│   └── app.js              # Configuração principal do aplicativo Express
├── server.js               # Ponto de entrada da aplicação
├── .env                    # Arquivo para variáveis de ambiente (credenciais, etc.)
├── .gitignore              # Arquivos e pastas a serem ignorados pelo Git
└── package.json            # Metadados do projeto e dependências
````

-   `server.js`: Inicia o servidor Express definido em `src/app.js`.
-   `src/app.js`: Configura o Express, importa as configurações, serviços e scrapers e define os endpoints da API (atualmente `/check_sites`).
-   `src/config/`: Contém arquivos de configuração.
-   `src/services/`: Contém serviços externos, como o de envio de e-mail.
-   `src/scrapers/`: Contém a lógica de web scraping, separada por método.
-   `.env`: Armazena variáveis de ambiente sensíveis ou de configuração.
-   `.gitignore`: Especifica arquivos e diretórios a serem ignorados pelo controle de versão (Git).
-   `package.json`: Gerencia as dependências e scripts do projeto.