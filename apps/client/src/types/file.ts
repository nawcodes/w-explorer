export interface File {
    id: string
    name: string
    path: string
    folder_id: string
    type: 'file'
    mime_type?: string
    size?: number
} 