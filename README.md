# Healthy Backend MVP

Plataforma de gestão de bem-estar focada em dados estruturados e gamificação.

## Pré-requisitos

- Node.js (v20+)
- Docker ou Podman
- Git

## Setup do Ambiente

### 1. Clone o repositório e instale as dependências

```bash
npm install
```

### 2. Configure o arquivo `.env` baseado no `.env.example`

```env
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/healthy_db?schema=public"
JWT_SECRET="sua_chave_secreta"
JWT_EXPIRES_IN="900"
```

### 3. Suba o banco de dados (Container)

**Docker**

```bash
docker-compose up -d
```

**Podman**

```bash
podman compose up -d
```

### 4. Aplique as migrações e gere o cliente Prisma

```bash
npx prisma migrate dev
npx prisma generate
npx prisma db seed
```

---

# Comandos Úteis

| Comando | Descrição |
|---------|-----------|
| `npm run start:dev` | Inicia o servidor em modo watch. |
| `npx prisma studio` | Abre a interface de visualização do banco de dados. |
| `npm run lint` | Verifica a qualidade do código. |

---

# Documentação Técnica: Arquitetura e Manutenção

Este documento detalha o **porquê** das decisões tomadas para facilitar a evolução do produto.

## Visão Arquitetural

O sistema segue os princípios de **Clean Architecture** e **Event-Driven Design**.

A comunicação entre módulos não é direta; ela ocorre através de um **Event Bus** (`EventEmitter`), garantindo que o módulo de **Gamificação** seja completamente independente dos módulos de **Saúde**.

---

## Decisões Técnicas Estratégicas

### 1. Driver Adapters (Prisma + `pg`)

Devido às exigências do Prisma 7.8, utilizamos o adaptador nativo do PostgreSQL. Isso garante melhor desempenho e evita conflitos de versão do WASM utilizados pelo Prisma.

### 2. Offline-First Readiness

Todos os registros utilizam **UUID v4** como chave primária.

Isso permite que o frontend (Flutter) crie registros localmente, evitando conflitos de IDs durante sincronizações futuras.

### 3. Soft Deletes

Todas as tabelas possuem a coluna `deletedAt`.

O sistema nunca realiza **Hard Delete**, atendendo aos requisitos de auditoria e conformidade com a **LGPD**.

### 4. Tratamento Centralizado de Exceções

O projeto utiliza um `GlobalExceptionFilter` para padronizar todas as respostas de erro em JSON.

O frontend nunca recebe *stack traces*, apenas mensagens tratadas e consistentes.

---

## Guia de Manutenção

### Como adicionar uma nova funcionalidade

Ao criar um novo módulo (por exemplo, **Sono**), siga sempre este fluxo:

1. Criar os **DTOs** para validação de entrada.
2. Implementar a lógica de negócio no **Service**, disparando o evento `habit.logged` quando aplicável.
3. Criar o **Controller**, responsável apenas pelo roteamento e injeção do `CurrentUser`.
4. Caso a ação gere XP, registrar o listener correspondente no `GamificationService`.

---

## Manutenção do Prisma

Sempre que o schema for alterado:

1. Edite o arquivo `prisma/schema.prisma`.
2. Execute:

```bash
npx prisma migrate dev --name <descricao_da_mudanca>
```

3. O Prisma atualizará automaticamente:

- O banco de dados;
- O `@prisma/client`;
- As definições de tipos utilizadas pelo TypeScript.

---

# Docker vs Podman

A diferença prática entre Docker e Podman é mínima neste projeto.

Caso algum desenvolvedor utilize **Docker Desktop** no Windows e encontre problemas de permissão, recomenda-se manter o projeto em um diretório sem caracteres especiais no caminho (por exemplo, `Documents/www/`).

O arquivo `docker-compose.yml` foi criado utilizando a especificação padrão da **OCI (Open Container Initiative)**, sendo compatível com Docker e Podman.