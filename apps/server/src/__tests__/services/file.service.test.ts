import { FileService } from '../../services/file-service'
import { FolderService } from '../../services/folder-service'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const fileService = new FileService()
const folderService = new FolderService()

describe('FileService', () => {
    let testFolderId: string

    beforeEach(async () => {
        // Bersihkan database
        const tables = ['file', 'folder']
        for (const table of tables) {
            await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`)
        }

        // Buat folder test untuk digunakan dalam test cases
        const folder = await folderService.createFolder({
            name: 'Test Folder'
        })
        testFolderId = folder.id
    })

    describe('createFile', () => {
        it('should create a new file', async () => {
            const fileData = {
                name: 'test.txt',
                folder_id: testFolderId,
                mime_type: 'text/plain',
                size: 1024
            }

            const file = await fileService.createFile(fileData)

            expect(file).toBeDefined()
            expect(file.name).toBe(fileData.name)
            expect(file.folder_id).toBe(testFolderId)
            expect(file.mime_type).toBe(fileData.mime_type)
            expect(file.size).toBe(fileData.size)
        })

        it('should throw error for non-existent folder', async () => {
            const fileData = {
                name: 'test.txt',
                folder_id: 'non-existent-folder',
                mime_type: 'text/plain'
            }

            await expect(fileService.createFile(fileData))
                .rejects
                .toThrow('Folder not found')
        })

        it('should create file with default size when not provided', async () => {
            const fileData = {
                name: 'test.txt',
                folder_id: testFolderId,
                mime_type: 'text/plain'
            }

            const file = await fileService.createFile(fileData)
            expect(file.size).toBe(0)
        })
    })

    describe('getAllFiles', () => {
        beforeEach(async () => {
            await fileService.createFile({
                name: 'file1.txt',
                folder_id: testFolderId
            })
            await fileService.createFile({
                name: 'file2.txt',
                folder_id: testFolderId
            })
        })

        it('should return all files', async () => {
            const files = await fileService.getAllFiles()
            expect(files).toHaveLength(2)
            expect(files[0]?.folder).toBeDefined()
        })
    })

    describe('getFileById', () => {
        let testFileId: string

        beforeEach(async () => {
            const file = await fileService.createFile({
                name: 'test.txt',
                folder_id: testFolderId
            })
            testFileId = file.id
        })

        it('should return file by id', async () => {
            const file = await fileService.getFileById(testFileId)
            expect(file).toBeDefined()
            expect(file?.id).toBe(testFileId)
            expect(file?.folder).toBeDefined()
        })

        it('should return null for non-existent file', async () => {
            const file = await fileService.getFileById('non-existent-id')
            expect(file).toBeNull()
        })
    })

    describe('deleteFile', () => {
        let testFileId: string

        beforeEach(async () => {
            const file = await fileService.createFile({
                name: 'test.txt',
                folder_id: testFolderId
            })
            testFileId = file.id
        })

        it('should delete a file', async () => {
            await fileService.deleteFile(testFileId)
            const file = await fileService.getFileById(testFileId)
            expect(file).toBeNull()
        })
    })

    describe('searchFiles', () => {
        beforeEach(async () => {
            await fileService.createFile({
                name: 'document.txt',
                folder_id: testFolderId
            })
            await fileService.createFile({
                name: 'image.jpg',
                folder_id: testFolderId
            })
        })

        it('should find files matching search term', async () => {
            const results = await fileService.searchFiles('doc')
            expect(results).toHaveLength(1)
            expect(results[0]?.name).toBe('document.txt')
        })

        it('should return empty array for no matches', async () => {
            const results = await fileService.searchFiles('xyz')
            expect(results).toHaveLength(0)
        })
    })

    describe('getFilesByFolderId', () => {
        beforeEach(async () => {
            await fileService.createFile({
                name: 'file1.txt',
                folder_id: testFolderId
            })
            await fileService.createFile({
                name: 'file2.txt',
                folder_id: testFolderId
            })
        })

        it('should return all files in folder', async () => {
            const files = await fileService.getFilesByFolderId(testFolderId)
            expect(files).toHaveLength(2)
        })

        it('should return empty array for non-existent folder', async () => {
            const files = await fileService.getFilesByFolderId('non-existent-folder')
            expect(files).toHaveLength(0)
        })
    })

    describe('createBulkFiles', () => {
        it('should create multiple files', async () => {
            const filesData = [
                {
                    name: 'file1.txt',
                    folder_id: testFolderId,
                    mime_type: 'text/plain'
                },
                {
                    name: 'file2.txt',
                    folder_id: testFolderId,
                    mime_type: 'text/plain'
                }
            ]

            const result = await fileService.createBulkFiles(filesData)
            expect(result.count).toBe(2)

            const allFiles = await fileService.getAllFiles()
            expect(allFiles).toHaveLength(2)
        })

        it('should skip files with invalid folder_id', async () => {
            const filesData = [
                {
                    name: 'file1.txt',
                    folder_id: 'invalid-id',
                    mime_type: 'text/plain'
                }
            ]

            const result = await fileService.createBulkFiles(filesData)
            expect(result.count).toBe(0)
        })
    })
}) 