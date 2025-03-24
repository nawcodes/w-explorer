import express from 'express';
import { prisma } from './utils/prisma';

const app = express();
const PORT = process.env.PORT || 3000;

const testConnection = async () => {
    try {
        await prisma.folder.findFirst()
        console.log('Connected to Prisma ORM')
    } catch (error) {
        console.error('Failed to connect to Prisma ORM', error)
    }
}

app.listen(PORT, async () => {
    await testConnection();
    console.log(`Server is running on http://localhost:${PORT}`);
});