// this shim is required
import { createExpressServer } from 'routing-controllers';
import { FolderController } from './controllers/folder-controller';
import dotenv from 'dotenv';
import { prisma } from './utils/prisma';

// creates express app, registers all controller routes and returns you express app instance
const app = createExpressServer({
    routePrefix: '/api',
    cors: true,
    controllers: [FolderController], // we specify controllers we want to use
    defaultErrorHandler: true,
});

dotenv.config();
const PORT = process.env.PORT || 3000;

async function testConnection() {
    try {
        await prisma.folder.findFirst()
        console.log('Connected to Prisma ORM')
    } catch (error) {
        console.error('Failed to connect to Prisma ORM', error)
    }
}

// run express application on port 3000
app.listen(PORT, async () => {
    await testConnection();
    console.log(`Server is running on http://localhost:${PORT}`);
});


