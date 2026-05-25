FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts tsconfig.json ./
ENV DATABASE_URL=mysql://luxora_user:luxora_password@mysql:3306/luxora_db
ENV SHADOW_DATABASE_URL=mysql://root:root_password@mysql:3306/luxora_shadow_db
RUN npx prisma generate

COPY src ./src
RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "docker:start"]
