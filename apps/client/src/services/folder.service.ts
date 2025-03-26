import { ApiService } from './api.service'
import type { Folder } from '../types/folder'
import type { File } from '../types/file'

interface FolderContents {
    folders: Folder[]
    files: File[]
}

export class FolderService {
    static async getAllFolders() {
        return await ApiService.get<Folder[]>('/folders')
    }

    static async getFolderById(id: string) {
        return await ApiService.get<Folder>(`/folders/${id}`)
    }

    static async createFolder(data: { name: string; parent_id?: string }) {
        try {
            const response = await ApiService.post<Folder>('/folders', data)
            return { data: response, error: null }
        } catch (error) {
            return { data: null, error }
        }
    }

    static async updateFolder(id: string, data: { name: string }) {
        return await ApiService.put<Folder>(`/folders/${id}`, data)
    }

    static async deleteFolder(id: string) {
        return await ApiService.delete<void>(`/folders/${id}`)
    }

    static async searchFolders(searchTerm: string) {
        return await ApiService.post<Folder[]>('/folders/search', { searchTerm })
    }

    static async getSubfolders(id: string) {
        try {
            const response = await ApiService.get<Folder[]>(`/folders/${id}/subfolders`)
            return { data: response, error: null }
        } catch (error) {
            return { data: null, error }
        }
    }

    static async getFolderPath(id: string) {
        try {
            const response = await ApiService.get<string>(`/folders/${id}/path`)
            return { data: response, error: null }
        } catch (error) {
            return { data: null, error }
        }
    }

    static async getFolderByPath(path: string) {

        try {
            const response = await ApiService.post<Folder>(`/folders/by-path`, {
                path: path
            })

            console.log(response);

            return { data: response, error: null }
        } catch (error) {
            return { data: null, error }
        }
    }

    static async uploadFiles(formData: FormData) {
        try {
            const response = await ApiService.post<any>('/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            return { data: response, error: null }
        } catch (error) {
            return { data: null, error }
        }
    }

    static async getFolderContents(folderId: string) {
        try {
            const response = await ApiService.get<FolderContents>(`/folders/${folderId}/contents`)
            return { data: response, error: null }
        } catch (error) {
            return { data: null, error }
        }
    }
} 