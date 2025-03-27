import { FolderService } from '../../services/folder-service'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const folderService = new FolderService()

describe('FolderService', () => {
    let testFolderId: string

    beforeEach(async () => {
        const tables = ['file', 'folder']
        for (const table of tables) {
            await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`)
        }

        // Create a test folder for use in tests
        const folder = await folderService.createFolder({ name: 'Test Folder' })
        testFolderId = folder.id
    })

    describe('getAllFolders', () => {
        it('should return all folders', async () => {
            await folderService.createFolder({ name: 'Another Folder' })
            const folders = await folderService.getAllFolders()
            expect(folders.length).toBeGreaterThan(0)
        })
    })

    describe('getFolderById', () => {
        it('should return folder by id', async () => {
            const folder = await folderService.getFolderById(testFolderId)
            expect(folder).toBeDefined()
            expect(folder?.id).toBe(testFolderId)
        })

        it('should return null for non-existent id', async () => {
            const folder = await folderService.getFolderById('non-existent-id')
            expect(folder).toBeNull()
        })
    })

    describe('createFolder', () => {
        it('should create a new folder', async () => {
            const folderData = {
                name: 'Test Folder',
            }

            const folder = await folderService.createFolder(folderData)

            expect(folder).toBeDefined()
            expect(folder.name).toBe(folderData.name)
        })

        it('should create a subfolder', async () => {
            const subfolderData = {
                name: 'Subfolder',
                parent_id: testFolderId
            }

            const subfolder = await folderService.createFolder(subfolderData)
            expect(subfolder).toBeDefined()
            expect(subfolder.parent_id).toBe(testFolderId)
            expect(subfolder.path).toBe('/Test Folder/Subfolder')
        })

        it('should handle duplicate folder names', async () => {
            const folderData = { name: 'Test Folder' }
            const duplicateFolder = await folderService.createFolder(folderData)
            expect(duplicateFolder.name).toMatch(/Test Folder-\d+/)
        })
    })

    describe('deleteFolder', () => {
        it('should delete a folder', async () => {
            await folderService.deleteFolder(testFolderId)
            const folder = await folderService.getFolderById(testFolderId)
            expect(folder).toBeNull()
        })

        it('should throw error for non-existent folder', async () => {
            await expect(folderService.deleteFolder('non-existent-id'))
                .rejects.toThrow('Folder not found')
        })

        it('should delete folder with all its contents', async () => {
            // Create a file in the folder
            await prisma.file.create({
                data: {
                    name: 'test.txt',
                    path: '/Test Folder/test.txt',
                    folder_id: testFolderId
                }
            })

            await folderService.deleteFolder(testFolderId)

            const files = await prisma.file.findMany({
                where: { folder_id: testFolderId }
            })
            expect(files).toHaveLength(0)
        })
    })

    describe('getDirectSubfolders', () => {
        it('should return direct subfolders', async () => {
            await folderService.createFolder({
                name: 'Subfolder 1',
                parent_id: testFolderId
            })
            await folderService.createFolder({
                name: 'Subfolder 2',
                parent_id: testFolderId
            })

            const subfolders = await folderService.getDirectSubfolders(testFolderId)
            expect(subfolders).toHaveLength(2)
        })
    })

    describe('createBulkFolders', () => {
        it('should create multiple folders', async () => {
            const foldersData = [
                { name: 'Bulk Folder 1' },
                { name: 'Bulk Folder 2' }
            ]

            const result = await folderService.createBulkFolders(foldersData)
            expect(result.count).toBe(2)
        })

        it('should create multiple subfolders', async () => {
            const foldersData = [
                { name: 'Bulk Subfolder 1', parent_id: testFolderId },
                { name: 'Bulk Subfolder 2', parent_id: testFolderId }
            ]

            const result = await folderService.createBulkFolders(foldersData)
            expect(result.count).toBe(2)

            const subfolders = await folderService.getDirectSubfolders(testFolderId)
            expect(subfolders).toHaveLength(2)
        })
    })

    describe('getFolderContents', () => {
        beforeEach(async () => {
            // Create a subfolder
            await folderService.createFolder({
                name: 'Subfolder',
                parent_id: testFolderId
            })

            // Create a file
            await prisma.file.create({
                data: {
                    name: 'test.txt',
                    path: '/Test Folder/test.txt',
                    folder_id: testFolderId
                }
            })
        })

        it('should return folder contents', async () => {
            const contents = await folderService.getFolderContents(testFolderId)
            expect(contents.folders).toHaveLength(1)
            expect(contents.files).toHaveLength(1)
        })

        it('should throw error for non-existent folder', async () => {
            await expect(folderService.getFolderContents('non-existent-id'))
                .rejects.toThrow('Folder not found')
        })
    })

    describe('searchItems', () => {
        beforeEach(async () => {
            await prisma.file.create({
                data: {
                    name: 'searchable.txt',
                    path: '/Test Folder/searchable.txt',
                    folder_id: testFolderId
                }
            })
            await folderService.createFolder({ name: 'Searchable Folder' })
        })

        it('should find both files and folders', async () => {
            const results = await folderService.searchItems('search')
            expect(results.data.length).toBe(2)
            expect(results.data.some(item => item.type === 'file')).toBe(true)
            expect(results.data.some(item => item.type === 'folder')).toBe(true)
        })
    })

    describe('getFolderByPath', () => {
        it('should return folder by path', async () => {
            const folderData = {
                name: 'Test Path Folder',
            }

            const createdFolder = await folderService.createFolder(folderData)
            const foundFolder = await folderService.getFolderByPath(folderData.name)

            expect(foundFolder).toBeDefined()
            expect(foundFolder?.id).toBe(createdFolder.id)
        })

        it('should return null for non-existent path', async () => {
            const folder = await folderService.getFolderByPath('non-existent')
            expect(folder).toBeNull()
        })
    })

    describe('searchFolders', () => {
        beforeEach(async () => {
            await folderService.createFolder({ name: 'Documents' })
            await folderService.createFolder({ name: 'Downloads' })
            await folderService.createFolder({ name: 'Desktop' })
        })

        it('should find folders matching search term', async () => {
            const results = await folderService.searchFolders('Doc')
            expect(results).toHaveLength(1)
            expect(results?.[0]?.name).toBe('Documents')
        })

        it('should return empty array for no matches', async () => {
            const results = await folderService.searchFolders('xyz')
            expect(results).toHaveLength(0)
        })
    })
})

