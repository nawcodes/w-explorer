import { FolderController } from '../../controllers/folder-controller'
import { FolderService } from '../../services/folder-service'
import type { Express } from 'express'
import request from 'supertest'
import { createExpressServer } from 'routing-controllers'
import { prisma } from '../../utils/prisma'

describe('FolderController', () => {
    let app: Express
    let folderController: FolderController
    let testFolderId: string

    beforeAll(() => {
        folderController = new FolderController()
        app = createExpressServer({
            controllers: [FolderController],
        })
    })

    beforeEach(async () => {
        // Bersihkan database sebelum setiap test
        const tables = ['file', 'folder'] // Ubah menjadi lowercase
        for (const table of tables) {
            await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`)
        }

        // Buat folder test untuk digunakan dalam test cases
        const folder = await request(app)
            .post('/folders')
            .send({ name: 'Test Folder' })
        testFolderId = folder.body.id
    })

    afterEach(async () => {
        // Bersihkan database setelah setiap test
        await prisma.file.deleteMany()
        await prisma.folder.deleteMany()
    })

    describe('POST /folders', () => {
        it('should create a new folder', async () => {
            const response = await request(app)
                .post('/folders')
                .send({ name: 'Test Folder' })

            expect(response.status).toBe(201)
            expect(response.body).toBeInstanceOf(Object)
        })

        it('should return error for invalid data', async () => {
            const response = await request(app)
                .post('/folders')
                .send({ name: '' })

            expect(response.status).toBe(400)
        })

        it('should create a subfolder', async () => {
            const response = await request(app)
                .post('/folders')
                .send({
                    name: 'Subfolder',
                    parent_id: testFolderId
                })

            expect(response.status).toBe(201)
            expect(response.body).toHaveProperty('name', 'Subfolder')
            expect(response.body).toHaveProperty('parent_id', testFolderId)
        })
    })

    describe('GET /folders', () => {
        it('should return all folders', async () => {
            const response = await request(app)
                .get('/folders')

            expect(response.status).toBe(200)
            expect(Array.isArray(response.body)).toBe(true)
        })
    })

    describe('GET /folders/:id', () => {
        it('should return a specific folder', async () => {
            const response = await request(app)
                .get(`/folders/${testFolderId}`)

            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty('id', testFolderId)
        })

        it('should return null for non-existent folder', async () => {
            const response = await request(app)
                .get('/folders/non-existent-id')

            expect(response.status).toBe(204)
            expect(response.body).toEqual({})
        })
    })

    describe('GET /folders/:id/subfolders', () => {
        it('should return direct subfolders', async () => {
            // Buat subfolder terlebih dahulu
            await request(app)
                .post('/folders')
                .send({
                    name: 'Subfolder',
                    parent_id: testFolderId
                })

            const response = await request(app)
                .get(`/folders/${testFolderId}/subfolders`)

            expect(response.status).toBe(200)
            expect(Array.isArray(response.body)).toBe(true)
            expect(response.body[0]).toHaveProperty('name', 'Subfolder')
        })
    })

    describe('DELETE /folders/:id', () => {
        it('should delete a folder', async () => {
            const response = await request(app)
                .delete(`/folders/${testFolderId}`)

            expect(response.status).toBe(200)

            // Verify folder is deleted
            const checkFolder = await request(app)
                .get(`/folders/${testFolderId}`)
            expect(checkFolder.body).toEqual({})
        })
    })

    describe('POST /folders/bulk', () => {
        it('should create multiple folders', async () => {
            const response = await request(app)
                .post('/folders/bulk')
                .send({
                    folders: [
                        { name: 'Folder 1' },
                        { name: 'Folder 2' }
                    ]
                })

            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty('count', 2)
        })
    })

    describe('GET /folders/:id/contents', () => {
        it('should return folder contents', async () => {
            const response = await request(app)
                .get(`/folders/${testFolderId}/contents`)

            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty('folders')
            expect(response.body).toHaveProperty('files')
        })

        it('should throw error for non-existent folder', async () => {
            const response = await request(app)
                .get('/folders/non-existent-id/contents')

            expect(response.status).toBe(500)
        })
    })

    describe('POST /folders/by-path', () => {
        it('should find folder by path', async () => {
            const response = await request(app)
                .post('/folders/by-path')
                .send({ path: 'Test Folder' })

            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty('name', 'Test Folder')
        })

        it('should return error for empty path', async () => {
            const response = await request(app)
                .post('/folders/by-path')
                .send({ path: '' })

            expect(response.status).toBe(500)
        })

        it('should return error for non-existent path', async () => {
            const response = await request(app)
                .post('/folders/by-path')
                .send({ path: 'Non Existent Folder' })

            expect(response.status).toBe(500)
        })
    })
})