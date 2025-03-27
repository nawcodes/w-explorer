FROM oven/bun:1

WORKDIR /app

COPY package.json .
COPY bun.lockb .
COPY apps/server/package.json ./apps/server/
COPY apps/server/prisma ./apps/server/prisma

RUN bun install

COPY apps/server ./apps/server

WORKDIR /app/apps/server

RUN bunx prisma generate

EXPOSE 3000

CMD ["bun", "run", "src/index.ts"] 