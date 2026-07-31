# ==========================================
# ESTÁGIO 1: BUILD (Ambiente de Construção)
# ==========================================
FROM node:20-slim AS builder

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app

# 1. Copiamos APENAS as dependências e o schema
COPY package*.json ./
COPY prisma ./prisma/

# 2. Instala os pacotes
RUN npm install

# 3. Geração do Cliente Prisma (O Pulo do Gato)
# Como o prisma.config.ts AINDA NÃO FOI COPIADO para a imagem, o Prisma 
# vai ler APENAS o schema.prisma. Isso elimina completamente o erro de 
# variável de ambiente e gera os tipos para o TypeScript com segurança.
RUN npx prisma generate

# 4. AGORA SIM, copiamos o restante do projeto (incluindo prisma.config.ts)
COPY . .

# 5. Compila o código
RUN npx tsc -p tsconfig.build.json

# ==========================================
# ESTÁGIO 2: PRODUÇÃO (Imagem Final Leve)
# ==========================================
FROM node:20-slim

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app

# Copiamos da fase anterior apenas o que importa para rodar
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/prisma.config.ts ./

EXPOSE 3000

# Aplica as migrations e sobe o app
CMD ["sh", "-c", "npx prisma migrate deploy --config prisma.config.ts && node dist/main.js"]