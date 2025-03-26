import { FolderService } from '../../services/folder-service'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const folderService = new FolderService()

describe('FolderService', () => {
    describe('createFolder', () => {
        it('should create a new folder', async () => {
            const folderData = {
                name: 'Test Folder',
            }

            const folder = await folderService.createFolder(folderData)

            expect(folder).toBeDefined()
            expect(folder.name).toBe(folderData.name)
        })

        it('should not create folder with duplicate name', async () => {
            const folderData = {
                name: 'Duplicate Folder',
            }

            await folderService.createFolder(folderData)

            await expect(folderService.createFolder(folderData)).rejects.toThrow()
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
            expect(results[0].name).toBe('Documents')
        })

        it('should return empty array for no matches', async () => {
            const results = await folderService.searchFolders('xyz')
            expect(results).toHaveLength(0)
        })
    })
})