import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

beforeAll(async () => {
    // Setup test database atau mock
    await prisma.$connect()
})

afterAll(async () => {
    await prisma.$disconnect()
})

afterEach(async () => {
    // Cleanup setelah setiap test
    const tables = ['File', 'Folder']
    for (const table of tables) {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`)
    }
}) 