import { PrismaClient } from "@prisma/client"

const prismaOrm = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma =
    prismaOrm.prisma ??
    new PrismaClient(
        {
            log: ['query']
        }
    )

/**
 * @todo conditional env == production if need it later.
 *  */
