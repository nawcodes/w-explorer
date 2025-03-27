FROM oven/bun:1

WORKDIR /app

# Salin semua file monorepo untuk mendukung workspaces
COPY . .

# Install dependencies untuk seluruh workspace
RUN bun install --frozen-lockfile

# Masuk ke client
WORKDIR /app/apps/client

EXPOSE 5173

# Jalankan client
CMD ["bun", "run", "dev", "--host"]