export interface Folder {
    id: string
    name: string
    path: string
    parent_id?: string
    subfolders?: Folder[]
    isOpen?: boolean
    type?: string
} 