import { FolderController } from '../../controllers/folder-controller'
import { FolderService } from '../../services/folder-service'
import type { Express } from 'express'
import request from 'supertest'
import { createExpressServer } from 'routing-controllers'

describe('FolderController', () => {
    let app: Express
    let folderController: FolderController

    beforeAll(() => {
        folderController = new FolderController()
        app = createExpressServer({
            controllers: [FolderController],
        })
    })

    describe('POST /folders', () => {
        it('should create a new folder', async () => {
            const response = await request(app)
                .post('/folders')
                .send({ name: 'Test Folder' })

            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty('name', 'Test Folder')
        })

        it('should return error for invalid data', async () => {
            const response = await request(app)
                .post('/folders')
                .send({ name: '' })

            expect(response.status).toBe(400)
        })
    })

    describe('GET /folders/search', () => {
        beforeEach(async () => {
            await request(app)
                .post('/folders')
                .send({ name: 'Documents' })
        })

        it('should return matching folders', async () => {
            const response = await request(app)
                .post('/folders/search')
                .send({ searchTerm: 'Doc' })

            expect(response.status).toBe(200)
            expect(response.body).toHaveLength(1)
            expect(response.body[0].name).toBe('Documents')
        })
    })
})