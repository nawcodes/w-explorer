import { FileController } from '../../controllers/file-controller'
import type { Express } from 'express'
import request from 'supertest'
import { createExpressServer } from 'routing-controllers'
import { prisma } from '../../utils/prisma'
import path from 'path'
import fs from 'fs/promises'

describe('FileController', () => {
    let app: Express
    let fileController: FileController
    let testFolderId: string
    let testFileId: string

    beforeAll(() => {
        fileController = new FileController()
        app = createExpressServer({
            controllers: [FileController],
        })
    })

    beforeEach(async () => {
        // Bersihkan database
        await prisma.file.deleteMany()
        await prisma.folder.deleteMany()

        // Buat folder test
        const folder = await prisma.folder.create({
            data: {
                name: 'Test Folder',
                path: '/Test Folder'
            }
        })
        testFolderId = folder.id

        // Buat file test
        const file = await prisma.file.create({
            data: {
                name: 'test.txt',
                path: '/Test Folder/test.txt',
                folder_id: testFolderId,
                mime_type: 'text/plain',
                size: 100
            }
        })
        testFileId = file.id
    })

    afterEach(async () => {
        // Bersihkan uploads folder jika ada file test
        try {
            const uploadsDir = path.join(process.cwd(), 'uploads')
            const files = await fs.readdir(uploadsDir)
            for (const file of files) {
                await fs.unlink(path.join(uploadsDir, file))
            }
        } catch (error) {
            console.error('Error cleaning uploads:', error)
        }
    })

    describe('GET /files', () => {
        it('should return all files', async () => {
            const response = await request(app)
                .get('/files')

            expect(response.status).toBe(200)
            expect(Array.isArray(response.body)).toBe(true)
            expect(response.body.length).toBeGreaterThan(0)
        })
    })

    describe('GET /files/:id', () => {
        it('should return a specific file', async () => {
            const response = await request(app)
                .get(`/files/${testFileId}`)

            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty('id', testFileId)
        })

        it('should return null for non-existent file', async () => {
            const response = await request(app)
                .get('/files/non-existent-id')

            expect(response.status).toBe(204)
            expect(response.body).toEqual({})
        })
    })

    describe('GET /files/folder/:folderId', () => {
        it('should return files in folder', async () => {
            const response = await request(app)
                .get(`/files/folder/${testFolderId}`)

            expect(response.status).toBe(200)
            expect(Array.isArray(response.body)).toBe(true)
            expect(response.body.length).toBe(1)
        })
    })

    describe('POST /files', () => {
        it('should create a new file', async () => {
            const fileData = {
                name: 'newfile.txt',
                folder_id: testFolderId,
                mime_type: 'text/plain',
                size: 100
            }

            const response = await request(app)
                .post('/files')
                .send(fileData)

            expect(response.status).toBe(201)
            expect(response.body).toHaveProperty('name', fileData.name)
        })

        it('should return error for invalid folder_id', async () => {
            const fileData = {
                name: 'newfile.txt',
                folder_id: 'invalid-id',
                mime_type: 'text/plain',
                size: 100
            }

            const response = await request(app)
                .post('/files')
                .send(fileData)

            expect(response.status).toBe(400)
        })
    })

    describe('POST /files/bulk', () => {
        it('should create multiple files', async () => {
            const filesData = {
                files: [
                    {
                        name: 'bulk1.txt',
                        folder_id: testFolderId,
                        mime_type: 'text/plain',
                        size: 100
                    },
                    {
                        name: 'bulk2.txt',
                        folder_id: testFolderId,
                        mime_type: 'text/plain',
                        size: 100
                    }
                ]
            }

            const response = await request(app)
                .post('/files/bulk')
                .send(filesData)

            expect(response.status).toBe(201)
            expect(response.body).toHaveProperty('count', 2)
        })
    })

    describe('DELETE /files/:id', () => {
        it('should delete a file', async () => {
            const response = await request(app)
                .delete(`/files/${testFileId}`)

            expect(response.status).toBe(200)

            // Verify file is deleted
            const checkFile = await request(app)
                .get(`/files/${testFileId}`)
            expect(checkFile.body).toMatchObject({})
        })
    })

    describe('POST /files/search', () => {
        it('should find files matching search term', async () => {
            const response = await request(app)
                .post('/files/search')
                .send({ searchTerm: 'test' })

            expect(response.status).toBe(200)
            expect(Array.isArray(response.body)).toBe(true)
            expect(response.body.length).toBeGreaterThan(0)
        })

        it('should return empty array for no matches', async () => {
            const response = await request(app)
                .post('/files/search')
                .send({ searchTerm: 'nonexistent' })

            expect(response.status).toBe(200)
            expect(response.body).toHaveLength(0)
        })
    })

    describe('POST /files/upload/bulk', () => {
        it('should upload multiple files', async () => {
            // Create test files
            const testFile1 = path.join(__dirname, 'test1.txt')
            const testFile2 = path.join(__dirname, 'test2.txt')
            await fs.writeFile(testFile1, 'test content 1')
            await fs.writeFile(testFile2, 'test content 2')

            const response = await request(app)
                .post('/files/upload/bulk')
                .field('folder_id', testFolderId)
                .attach('files', testFile1)
                .attach('files', testFile2)

            expect(response.status).toBe(201)
            expect(response.body).toHaveProperty('message', 'Files uploaded successfully')
            expect(response.body.files).toHaveLength(2)

            // Cleanup test files
            await fs.unlink(testFile1)
            await fs.unlink(testFile2)
        })

        it('should return error when no files are uploaded', async () => {
            const response = await request(app)
                .post('/files/upload/bulk')
                .field('folder_id', testFolderId)

            expect(response.status).toBe(500)
        })
    })
}) 