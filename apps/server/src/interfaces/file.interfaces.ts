export interface FileInterface {
    id: string;
    name: string;
    path: string;
    created_at: Date;
    updated_at: Date;
    folder_id: string;
    mime_type?: string;
    size?: number;
    physical_path?: string;
}