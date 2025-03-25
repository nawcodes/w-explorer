import { IsString, IsOptional, IsUUID, IsNumber, IsArray, ValidateNested, Length, Matches, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFileDto {
    @IsString()
    @Length(1, 255)
    @Matches(/^[^<>:"/\\|?*]+$/, {
        message: 'File name contains invalid characters'
    })
    name: string;

    @IsUUID()
    folder_id: string;

    @IsOptional()
    @IsString()
    mime_type?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    size?: number;
}

export class UpdateFileDto {
    @IsOptional()
    @IsString()
    @Length(1, 255)
    @Matches(/^[^<>:"/\\|?*]+$/, {
        message: 'File name contains invalid characters'
    })
    name?: string;

    @IsOptional()
    @IsString()
    mime_type?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    size?: number;
}

export class BulkCreateFileDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateFileDto)
    files: CreateFileDto[];
}

export class BulkUpdateFileDto {
    @IsUUID()
    id: string;

    @IsOptional()
    @IsString()
    @Length(1, 255)
    @Matches(/^[^<>:"/\\|?*]+$/, {
        message: 'File name contains invalid characters'
    })
    name?: string;

    @IsOptional()
    @IsString()
    mime_type?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    size?: number;
}

export class SearchFileDto {
    @IsString()
    @Length(1, 255)
    searchTerm: string;
}

export class BulkDeleteFileDto {
    @IsArray()
    @IsUUID("all", { each: true })
    ids: string[];
} 