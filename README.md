# WExplorer

## Commands

1. `bun run dev` Run Both Server and Client
2. `bun run dev:server-prisma-migrate` - Run only the server migrate (Need set DB Url on environment first)
3. `bun run dev:server-seed` - Run only the server seed (Need set DB Url on environment)

## Requirements

1. Vue v3^
2. NodeJS v18^
3. Bun v1^
4. PostgreSQL v15^

## Setup and Install

1. At root folder run `bun install`
2. Set up environment on Apps/Client/Server just duplicate the `env.example` and renamed to `.env`
3. Adjust your URL DB on environment
4. Run `bun run dev:server-migrate-dev`
5. (Optional) Run `bun run dev:server-seed`
6. Run `bun run dev:server
