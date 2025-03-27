import { prisma } from '../utils/prisma'
import fs from 'fs/promises';
import path from 'path';
import { FileInterface } from '../interfaces/file.interfaces';

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
        size?: number,
        physical_path?: string
    }) {
        const folder = await prisma.folder.findUnique({
            where: { id: data.folder_id }
        });

        if (!folder) {
            throw new Error('Folder not found');
        }

        const physicalFileName = data.physical_path?.split('/').pop() || data.name;
        const virtualPath = `${folder.path}/${physicalFileName}`.replace(/\/+/g, '/');

        return await prisma.file.create({
            data: {
                name: data.name,
                path: virtualPath,
                folder_id: data.folder_id,
                mime_type: data.mime_type,
                size: data.size ?? 0,
                physical_path: data.physical_path
            }
        });
    }

    /**
     * @deprecated
     * @note not including on the scope of the project
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
        let updateData: FileInterface = { ...data } as FileInterface
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
     * @todo: later
     */
    async deleteFile(id: string) {
        const file = await prisma.file.findUnique({
            where: { id }
        });

        if (file?.physical_path) {
            try {
                const fullPath = path.join(process.cwd(), 'uploads', file.physical_path);
                // unlink file
                await fs.unlink(fullPath);
            } catch (error) {
                console.error('Error deleting physical file:', error);
            }
        }

        return await prisma.file.delete({
            where: { id }
        });
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

    /**
     * Create multiple files
     */
    async createBulkFiles(data: Array<{
        name: string,
        folder_id: string,
        mime_type?: string,
        size?: number
    }>) {
        const files = []

        for (const item of data) {
            const folder = await prisma.folder.findUnique({
                where: { id: item.folder_id }
            })

            if (folder) {
                const filePath = `${folder.path}/${item.name}`.replace(/\/+/g, '/')
                files.push({
                    name: item.name,
                    path: filePath,
                    folder_id: item.folder_id,
                    mime_type: item.mime_type,
                    size: item.size ?? 0
                })
            }
        }

        return await prisma.file.createMany({
            data: files
        })
    }

    /**
     * Update multiple files
     * @deprecated
     * @note not including on the scope of the project
     */
    async updateBulkFiles(data: Array<{
        id: string,
        name?: string,
        mime_type?: string,
        size?: number
    }>) {
        const updates = []

        for (const item of data) {
            const file = await prisma.file.findUnique({
                where: { id: item.id },
                include: { folder: true }
            })

            if (file) {
                const updateData: any = { ...item }
                if (item.name) {
                    updateData.path = `${file.folder.path}/${item.name}`.replace(/\/+/g, '/')
                }

                updates.push(
                    prisma.file.update({
                        where: { id: item.id },
                        data: updateData
                    })
                )
            }
        }

        return await prisma.$transaction(updates)
    }

    /**
     * @deprecated
     * @note not including on the scope of the project
     */
    async deleteBulkFiles(ids: string[]) {
        return await prisma.file.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        })
    }
}
