FROM oven/bun:1

WORKDIR /app

# Salin semua file monorepo untuk mendukung workspaces
COPY . .

# Install dependencies untuk seluruh workspace
RUN bun install --frozen-lockfile

# Masuk ke server
WORKDIR /app/apps/server

# Generate Prisma Client
RUN bunx prisma generate

EXPOSE 3000

# Jalankan server
CMD ["bun", "run", "src/index.ts"]