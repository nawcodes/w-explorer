// this shim is required
import { createExpressServer, useContainer } from 'routing-controllers';
import { Container } from 'typedi';
import { FolderController } from './controllers/folder-controller';
import { FileController } from './controllers/file-controller';
import dotenv from 'dotenv';
import { prisma } from './utils/prisma';

// Enable validation
useContainer(Container);

// creates express app, registers all controller routes and returns you express app instance
const app = createExpressServer({
    routePrefix: '/api',
    cors: true,
    controllers: [FolderController, FileController],
    validation: {
        whitelist: true,
        forbidNonWhitelisted: true,
    },
    defaultErrorHandler: true,
});

dotenv.config();
const PORT = process.env.PORT || 3000;

async function testConnection() {
    try {
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


