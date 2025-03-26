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
    }) {
        // if parent_id, get parent path
        let parentPath = '/'
        if (data.parent_id) {
            const parent = await prisma.folder.findUnique({
                where: { id: data.parent_id },
                include: {
                    parent: true
                }
            })
            if (parent) {
                parentPath = parent.path
            }
        }

        // create new path dengan memastikan ada slash di antara parent dan nama folder
        const newPath = parentPath === '/'
            ? `/${data.name}`
            : `${parentPath}/${data.name}`

        return await prisma.folder.create({
            data: {
                name: data.name,
                path: newPath,
                parent_id: data.parent_id,
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

    /**
     * Create multiple folders
     */
    async createBulkFolders(data: Array<{
        name: string,
        parent_id?: string,
    }>) {
        const folders = []

        for (const item of data) {
            let parentPath = '/'
            if (item.parent_id) {
                const parent = await prisma.folder.findUnique({
                    where: { id: item.parent_id }
                })
                if (parent) {
                    parentPath = parent.path
                }
            }

            const newPath = `${parentPath}${item.name}`.replace(/\/+/g, '/')
            folders.push({
                name: item.name,
                path: newPath,
                parent_id: item.parent_id,
            })
        }

        return await prisma.folder.createMany({
            data: folders
        })
    }

    /**
     * Update multiple folders
     */
    async updateBulkFolders(data: Array<{
        id: string,
        name?: string,
    }>) {
        const updates = []

        for (const item of data) {
            const folder = await prisma.folder.findUnique({
                where: { id: item.id }
            })

            if (folder && item.name) {
                const parentPath = folder.path.substring(0, folder.path.lastIndexOf('/'))
                const newPath = `${parentPath}/${item.name}`.replace(/\/+/g, '/')
                updates.push(
                    prisma.folder.update({
                        where: { id: item.id },
                        data: {
                            name: item.name,
                            path: newPath
                        }
                    })
                )
            }
        }

        return await prisma.$transaction(updates)
    }

    /**
     * Delete multiple folders
     */
    async deleteBulkFolders(ids: string[]) {
        // First delete all files in these folders
        await prisma.file.deleteMany({
            where: {
                folder_id: {
                    in: ids
                }
            }
        })

        return await prisma.folder.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        })
    }

    /**
     * Get folder contents
     * @param id 
     * @returns 
     */
    async getFolderContents(id: string) {
        const contents = await prisma.folder.findUnique({
            where: { id },
            include: {
                files: true,
                subfolders: {
                    include: {
                        files: true,
                        parent: true
                    }
                }
            }
        })

        if (!contents) {
            throw new Error('Folder not found')
        }

        return {
            folders: contents.subfolders.map(subfolder => ({
                ...subfolder,
                type: 'folder',
                // Pastikan path menggunakan format yang benar
                path: subfolder.parent
                    ? `${subfolder.parent.path}/${subfolder.name}`
                    : `/${subfolder.name}`
            })),
            files: contents.files.map(file => ({
                ...file,
                type: 'file'
            }))
        }
    }

    async getFolderByPath(path: string) {
        const folder = await prisma.folder.findFirst({
            where: {
                name: path // Cari berdasarkan nama folder
            },
            include: {
                files: true,
                subfolders: {
                    include: {
                        files: true
                    }
                }
            }
        })

        if (!folder) {
            return null
        }

        return {
            ...folder,
            type: 'folder',
            subfolders: folder.subfolders.map(sub => ({
                ...sub,
                type: 'folder'
            })),
            files: folder.files.map(file => ({
                ...file,
                type: 'file'
            }))
        }
    }
}
