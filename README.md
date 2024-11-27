# Links

## Repositório com a documentação

- https://github.com/jonascsilva/portfolio

---

# StudyNest-Backend

Este repositório contém o código do backend da aplicação StudyNest, uma aplicação de gerenciamento de flashcards com um algoritmo de repetição espaçada.

## Tecnologias Utilizadas

- **Linguagens e Frameworks**

  - [Node.js](https://nodejs.org) versão 20 como ambiente de execução.
  - [NestJS](https://nestjs.com) para a construção da API backend.
  - [TypeScript](https://typescriptlang.org) para tipagem estática e desenvolvimento seguro.

- **Banco de Dados**

  - [PostgreSQL](https://postgresql.org) como sistema de gerenciamento de banco de dados relacional.
  - [TypeORM](https://typeorm.io) para mapeamento objeto-relacional e gerenciamento de migrações.

- **Autenticação e Segurança**

  - [JWT](https://jwt.io) para autenticação baseada em tokens.
  - [Passport](http://passportjs.org) para estratégias de autenticação.

- **Validação e Transformação**

  - [class-validator](https://github.com/typestack/class-validator) para validação de dados.
  - [class-transformer](https://github.com/typestack/class-transformer) para transformação de objetos.

- **Ferramentas de Desenvolvimento**

  - [ESLint](https://eslint.org) para análise estática de código e manutenção de padrões.
  - [Prettier](https://prettier.io) para formatação consistente de código.
  - [Jest](https://jestjs.io) para testes unitários.
  - [Supertest](https://github.com/visionmedia/supertest) para testes de integração de APIs.

## Pré-requisitos

- [Node.js](https://nodejs.org) versão 20
- [Docker](https://docker.com) (opcional, para ambiente de desenvolvimento via Docker)
- [PostgreSQL](https://postgresql.org) caso não utilize Docker

## Como Executar

### Instalação das Dependências

Utilizando o npm, execute o seguinte comando dentro do diretório do projeto:

```bash
npm install
```

### Configuração das Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as configurações necessárias. Você pode utilizar o arquivo `.env.example` como base.

- `AI_KEY`: É a API key do Gemini
- `JWT_SECRET`: É uma string aleatória

### Executar em Ambiente de Desenvolvimento

#### Usando Node.js

Inicie o servidor de desenvolvimento com o comando:

```bash
npm run start:dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

#### Usando Docker

Certifique-se de ter o Docker instalado e em execução. Execute o seguinte comando para iniciar os serviços backend e PostgreSQL:

```bash
docker compose up
```

A aplicação estará acessível em [http://localhost:3000](http://localhost:3000).

### Compilar para Produção

Para compilar a aplicação para ambiente de produção, utilize:

```bash
npm run build
```

### Executar a Aplicação Compilada

Após a compilação, inicie a aplicação com:

```bash
npm run start:prod
```

### Lint e Formatação

Para verificar o código com as ferramentas de linting e formatação, execute:

```bash
npm run lint
```

Para corrigir automaticamente os problemas encontrados, utilize:

```bash
npm run lint-fix
```

### Executar Testes

Para rodar os testes unitários, utilize:

```bash
npm run test
```

Outros comandos de teste disponíveis:

- `test:watch`: Executa os testes em modo de observação.
- `test:cov`: Gera um relatório de cobertura de testes.
- `test:e2e`: Executa os testes de integração de ponta a ponta.

### Gerenciamento de Banco de Dados

Para gerar migrações, executar migrações, reverter migrações ou semear o banco de dados, utilize os seguintes comandos:

- **Gerar Migração:**

  ```bash
  npm run migration:generate
  ```

- **Executar Migrações:**

  ```bash
  npm run migration:run
  ```

- **Reverter Migrações:**

  ```bash
  npm run migration:revert
  ```

- **Semear o Banco de Dados:**

  ```bash
  npm run db:seed
  ```
