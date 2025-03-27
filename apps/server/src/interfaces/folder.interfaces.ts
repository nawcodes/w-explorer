export interface Folder {
    id: string;
    name: string;
    path: string;
    created_at: Date;
    updated_at: Date;
    parent_id?: string;
}