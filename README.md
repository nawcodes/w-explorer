# WExplorer
## Preview 
![image](https://github.com/user-attachments/assets/f02a4fe0-a772-4b15-b0ef-5752b2b367d6)


## Commands

1. bun dev:server
2. bun dev:client
3. `bun run dev:server-prisma-migrate` - Run only the server migrate (Need set DB Url on environment first)
4. `bun run dev:server-seed` - Run only the server seed (Need set DB Url on environment)

## Requirements

1. Vue `v3^`
2. NodeJS `v18^`
3. Bun `v1^`
4. PostgreSQL `v15^`

## Setup and Install

1. At root folder run `bun install`
   > - For make sure do at `apps/server` then run `bun install`
   > - also at `apps/client` run `bun install`
2. Set up environment on Apps/Client/Server just duplicate the `env.example` and renamed to `.env`
3. Adjust your URL DB on environment
4. Run `bun run dev:server-migrate-dev`
5. (Optional) Run `bun run dev:server-seed`
6. Run `bun run dev:server

## Unitest

### Server

1. At directory `apps/server` run:
   > bun run jest --clearCache && bun test
   > result last
![image](https://github.com/user-attachments/assets/c03a45c1-ea65-4548-8c03-3c54d7dea12d)


### Client

> `Pending ...`

## Setup Via Docker
> `Pending ...`




