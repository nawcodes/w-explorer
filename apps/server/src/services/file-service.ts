import { prisma } from '../utils/prisma'

export class FileService {
    /**
     * get all files
     * @returns 
     */
    async getAllFiles() {
        return await prisma.file.findMany({
            include: {
                folder: true
            }
        })
    }

    /**
     * get file by id
     * @param id 
     * @returns 
     */
    async getFileById(id: string) {
        return await prisma.file.findUnique({
            where: { id },
            include: {
                folder: true
            }
        })
    }

    /**
     * create new file
     * @param data 
     * @returns 
     */
    async createFile(data: {
        name: string,
        folder_id: string,
        mime_type?: string,
        size?: number
    }) {
        // get folder path
        const folder = await prisma.folder.findUnique({
            where: { id: data.folder_id }
        })

        if (!folder) {
            throw new Error('Folder not found')
        }

        // create file path
        const filePath = `${folder.path}/${data.name}`.replace(/\/+/g, '/')

        return await prisma.file.create({
            data: {
                name: data.name,
                path: filePath,
                folder_id: data.folder_id,
                mime_type: data.mime_type,
                size: data.size ?? 0
            }
        })
    }

    /**
     * update file
     * @param id 
     * @param data 
     * @returns 
     */
    async updateFile(id: string, data: {
        name?: string,
        mime_type?: string,
        size?: number
    }) {
        const file = await prisma.file.findUnique({
            where: { id },
            include: { folder: true }
        })

        if (!file) {
            throw new Error('File not found')
        }

        // if name changed, update path
        let updateData = { ...data }
        if (data.name) {
            updateData.path = `${file.folder.path}/${data.name}`.replace(/\/+/g, '/')
        }

        return await prisma.file.update({
            where: { id },
            data: updateData
        })
    }

    /**
     * delete file
     * @param id 
     * @returns 
     */
    async deleteFile(id: string) {
        return await prisma.file.delete({
            where: { id }
        })
    }

    /**
     * search files by name
     * @param searchTerm 
     * @returns 
     */
    async searchFiles(searchTerm: string) {
        return await prisma.file.findMany({
            where: {
                name: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            },
            include: {
                folder: true
            }
        })
    }

    /**
     * get all files in folder
     * @param folderId 
     * @returns 
     */
    async getFilesByFolderId(folderId: string) {
        return await prisma.file.findMany({
            where: {
                folder_id: folderId
            }
        })
    }
}
