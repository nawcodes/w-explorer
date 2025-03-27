FROM oven/bun:1

WORKDIR /app

COPY package.json .
COPY bun.lockb .
COPY apps/client/package.json ./apps/client/

RUN bun install

COPY apps/client ./apps/client

WORKDIR /app/apps/client

EXPOSE 5173

CMD ["bun", "run", "dev", "--host"] 