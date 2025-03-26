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

    static async searchFiles(searchTerm: string) {
        return await ApiService.post<File[]>('/files/search', { searchTerm })
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

            return { data: response, error: null }
        } catch (error) {
            return { data: null, error }
        }
    }

    static async uploadFiles(files: File[], folderId: string) {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file as unknown as Blob);
        });
        formData.append('folder_id', folderId);
        try {
            const response = await fetch(new URL('http:localhost:3000/api/files/upload/bulk'), {
                method: 'POST',
                body: formData,
                headers: {
                }
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            const result = await response.json();
            console.log("Upload success:", result);
            return result;
        } catch (error) {
            console.error("Upload error:", error);
            throw error;
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

    static async deleteFile(fileId: string) {
        return await ApiService.delete<void>(`/files/${fileId}`)
    }
} 