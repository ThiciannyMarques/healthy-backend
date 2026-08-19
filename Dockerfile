# ==========================================
# ESTÁGIO 1: BUILD (Ambiente de Construção)
# ==========================================
FROM node:20-slim AS builder

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app

# Copia dependências e schema
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

# Gera o Prisma Client
RUN npx prisma generate

# Copia o código fonte e configs
COPY . .

# Garante que não sobrou lixo de build anterior dentro de src
RUN rm -rf src/**/dist dist

# Executa o build limpo do NestJS
RUN npm run build

# ==========================================
# ESTÁGIO 2: PRODUÇÃO (Imagem Final Leve)
# ==========================================
FROM node:20-slim

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/prisma.config.ts ./

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy --config prisma.config.ts && node dist/main.js"]