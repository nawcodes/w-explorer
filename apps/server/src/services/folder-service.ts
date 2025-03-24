import { prisma } from '../utils/prisma'

export class FolderService {

    /**
     * get all folders
     * @returns 
     */
    async getAllFolders() {
        return await prisma.folder.findMany({
            include: {
                files: true,
                subfolders: true
            }
        })
    }

    async getFolderById(id: string) {
        return await prisma.folder.findUnique({
            where: { id },
            include: {
                files: true,
                subfolders: true,
                parent: true
            }
        })
    }

    /**
     * create onces folder
     * @param data 
     * @returns 
     */
    async createFolder(data: {
        name: string,
        parent_id?: string,
        is_system?: boolean,
        is_hidden?: boolean
    }) {
        // if parent_id, get parent path
        let parentPath = '/'
        if (data.parent_id) {
            const parent = await prisma.folder.findUnique({
                where: { id: data.parent_id }
            })
            if (parent) {
                parentPath = parent.path
            }
        }

        // create new path
        const newPath = `${parentPath}${data.name}`.replace(/\/+/g, '/')

        return await prisma.folder.create({
            data: {
                name: data.name,
                path: newPath,
                parent_id: data.parent_id,
                is_system: data.is_system ?? false,
                is_hidden: data.is_hidden ?? false
            }
        })
    }


    /**
     * update onces folder
     * @param id 
     * @param data 
     * @returns 
     */
    async updateFolder(id: string, data: {
        name?: string,
        is_system?: boolean,
        is_hidden?: boolean
    }) {
        const folder = await prisma.folder.findUnique({
            where: { id }
        })

        if (!folder) {
            throw new Error('Folder not found')
        }

        // if name changed, update path
        let updateData = { ...data }
        if (data.name) {
            const parentPath = folder.path.substring(0, folder.path.lastIndexOf('/'))
            updateData.path = `${parentPath}/${data.name}`.replace(/\/+/g, '/')
        }

        return await prisma.folder.update({
            where: { id },
            data: updateData
        })
    }


    /**
     * delete onces folder
     * @param id 
     * @returns 
     */
    async deleteFolder(id: string) {
        // first delete all subfolders and files recursively
        const folder = await prisma.folder.findUnique({
            where: { id },
            include: {
                subfolders: true,
                files: true
            }
        })

        if (!folder) {
            throw new Error('Folder not found')
        }

        // delete all files in folder
        await prisma.file.deleteMany({
            where: { folder_id: id }
        })

        // delete folder and all subfolders
        return await prisma.folder.delete({
            where: { id }
        })
    }

    /**
     * get direct subfolders
     * @param id 
     * @returns 
     */
    async getDirectSubfolders(id: string) {
        return await prisma.folder.findMany({
            where: { parent_id: id },
            include: {
                files: true
            }
        })
    }

    /**
     * search folders by name
     * @param searchTerm 
     * @returns 
     */
    async searchFolders(searchTerm: string) {
        return await prisma.folder.findMany({
            where: {
                name: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            },
            include: {
                files: true,
                parent: true
            }
        })
    }
}
