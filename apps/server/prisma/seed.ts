import { faker } from '@faker-js/faker'
import { FolderService } from '../src/services/folder-service'
import { FileService } from '../src/services/file-service'
import { mimeTypes } from '../src/types/mime-types'
import { prisma } from '../src/utils/prisma'
import { randomInt } from '../src/services/utils-service'

const folderService = new FolderService()
const fileService = new FileService()

// Mime types
const MIME_TYPES = mimeTypes

const CONFIG_SEED = {
    folder: {
        min: 10,
        max: randomInt(20, 30)
    },
    file: {
        min: 10,
        max: randomInt(20, 30)
    }
}

// unique name for path
function generateUniqueName(baseName: string): string {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
    return `${baseName}_${timestamp}${random}`
}

// Create random files in batch
async function createRandomFiles(folderId: string) {
    const fileCount = faker.number.int(
        {
            min: CONFIG_SEED.file.min,
            max: CONFIG_SEED.file.max
        })

    // prepare file data
    const fileData = []
    for (let i = 0; i < fileCount; i++) {
        const extension = faker.helpers.arrayElement(Object.keys(MIME_TYPES))
        const baseFileName = faker.system.fileName().split('.')[0] || faker.system.fileName()
        // unique name for file
        const fileName = `${generateUniqueName(baseFileName)}.${extension}`

        fileData.push({
            name: fileName,
            folder_id: folderId,
            mime_type: MIME_TYPES[extension as keyof typeof MIME_TYPES],
            size: faker.number.int({ min: 1024, max: 10485760 })
        })
    }

    // create files in batch
    return await fileService.createBulkFiles(fileData)
}

// Create folder structure with batch processing
async function createFolderStructure(parentId: string | null): Promise<void> {

    const folderCount = faker.number.int(
        {
            min: CONFIG_SEED.folder.min,
            max: CONFIG_SEED.folder.max
        })

    const folderData = []
    // Prepare folder data
    for (let i = 0; i < folderCount; i++) {
        const baseFolderName = faker.system.directoryPath().split('/').pop() || faker.system.fileName()
        const folderName = generateUniqueName(baseFolderName) + `_${i}`

        folderData.push({
            name: folderName,
            parent_id: parentId ?? undefined,
        })
    }

    // Create folders in batch
    const result = await folderService.createBulkFolders(folderData)

    // Get all created folders and create files for each
    const folders = await prisma.folder.findMany({
        where: {
            parent_id: parentId ?? undefined
        }
    })

    // Create files for each folder
    for (const folder of folders) {
        await createRandomFiles(folder.id)
    }
}

async function main() {
    console.log('🌱 Mulai seeding...')

    await prisma.file.deleteMany()
    await prisma.folder.deleteMany()

    try {

        // generate root folder 
        for (let i = 0; i < randomInt(10, 50); i++) {
            const rootName = generateUniqueName(faker.system.fileName())
            const rootFolder = await folderService.createFolder({
                name: rootName,
            })

            await createFolderStructure(rootFolder.id)
        }
        console.log('✅ Seeding selesai!')
    } catch (error) {
        console.error('❌ Error dalam seeding:', error)
        throw error
    }
}

main()
    .catch((e) => {
        console.error('❌ Error dalam seeding:', e)
        process.exit(1)
    })
