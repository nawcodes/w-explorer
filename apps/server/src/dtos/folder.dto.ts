import { IsString, IsOptional, IsUUID, IsArray, ValidateNested, Length, Matches } from 'class-validator';
import { Type } from 'class-transformer';


export class CreateFolderDto {
    @IsString()
    @Length(1, 255)
    @Matches(/^[^<>:"/\\|?*]+$/, {
        message: 'Folder name contains invalid characters'
    })
    name: string;

    @IsOptional()
    @IsUUID()
    parent_id?: string;
}

export class UpdateFolderDto {
    @IsString()
    @Length(1, 255)
    @Matches(/^[^<>:"/\\|?*]+$/, {
        message: 'Folder name contains invalid characters'
    })
    name: string;
}

export class BulkCreateFolderDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateFolderDto)
    folders: CreateFolderDto[];
}

export class BulkUpdateFolderDto {
    @IsUUID()
    id: string;

    @IsString()
    @Length(1, 255)
    @Matches(/^[^<>:"/\\|?*]+$/, {
        message: 'Folder name contains invalid characters'
    })
    name: string;
}

export class SearchFolderDto {
    @IsString()
    @Length(1, 255)
    searchTerm: string;
}

export class BulkDeleteFolderDto {
    @IsArray()
    @IsUUID("all", { each: true })
    ids: string[];
} 