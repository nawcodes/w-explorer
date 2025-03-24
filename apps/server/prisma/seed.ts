import { faker } from '@faker-js/faker'
import { FolderService } from '../src/services/folder-service'
import { FileService } from '../src/services/file-service'
import { mimeTypes } from '../src/types/mime-types'
import { randomInt } from '../src/services/utils-service'
const folderService = new FolderService()
const fileService = new FileService()

// config seed
const CONFIG = {
    MAIN_FOLDERS: randomInt(1, 5),
    MAX_SUBFOLDERS: randomInt(1, 3),
    MAX_FILES: randomInt(1, 4),
    MAX_DEPTH: randomInt(1, 3),
}

// mime types
const MIME_TYPES = mimeTypes

// create random files
async function createRandomFiles(folderId: string, count: number) {
    const files = []
    for (let i = 0; i < count; i++) {
        const extension = faker.helpers.arrayElement(Object.keys(MIME_TYPES))
        const fileName = `${faker.system.fileName().split('.')[0]}.${extension}`

        files.push(await fileService.createFile({
            name: fileName,
            folder_id: folderId,
            mime_type: MIME_TYPES[extension as keyof typeof MIME_TYPES],
            size: faker.number.int({ min: 1024, max: 10485760 }) // 1KB to 10MB
        }))
    }
    return files
}

// create folder structure
async function createFolderStructure(
    parentId: string | null,
    depth: number
): Promise<void> {
    if (depth > CONFIG.MAX_DEPTH) return

    const folderCount = parentId === null
        ? CONFIG.MAIN_FOLDERS
        : faker.number.int({ min: 0, max: CONFIG.MAX_SUBFOLDERS })

    for (let i = 0; i < folderCount; i++) {
        // create folder
        const folderName = faker.system.directoryPath().split('/').pop() || faker.system.fileName()
        const newFolder = await folderService.createFolder({
            name: folderName,
            parent_id: parentId ?? undefined,
            is_system: faker.datatype.boolean(),
            is_hidden: faker.datatype.boolean()
        })

        // create random files
        const fileCount = faker.number.int({ min: 0, max: CONFIG.MAX_FILES })
        await createRandomFiles(newFolder.id, fileCount)

        // create subfolders recursively
        await createFolderStructure(newFolder.id, depth + 1)
    }
}

async function main() {
    console.log('🌱 Mulai seeding...')

    try {
        // create root folder
        const rootFolder = await folderService.createFolder({
            name: 'Root',
            is_system: true,
        })

        // create folder structure from root
        await createFolderStructure(rootFolder.id, 1)

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
