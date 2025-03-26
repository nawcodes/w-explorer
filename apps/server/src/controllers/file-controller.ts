import type { Request, Response } from 'express';
import 'reflect-metadata';
import { Controller, Param, Body, Get, Post, Put, Delete, JsonController, Res, HttpCode, UploadedFile, UploadedFiles, UseBefore, Req } from 'routing-controllers';
import { FileService } from '../services/file-service';
import {
    CreateFileDto,
    UpdateFileDto,
    BulkCreateFileDto,
    BulkUpdateFileDto,
    SearchFileDto,
    BulkDeleteFileDto
} from '../dtos/file.dto';
import { Service } from 'typedi';
import path from 'path';
import { uploadConfig } from '../utils/multer.config';

@JsonController('/files')
@Service()
export class FileController {
    private fileService: FileService;

    constructor() {
        this.fileService = new FileService();
    }

    @Get()
    async getAll() {
        return await this.fileService.getAllFiles();
    }

    @Get('/:id')
    async getOne(@Param('id') id: string) {
        return await this.fileService.getFileById(id);
    }

    @Get('/folder/:folderId')
    async getFilesByFolder(@Param('folderId') folderId: string) {
        return await this.fileService.getFilesByFolderId(folderId);
    }

    @Post()
    @HttpCode(201)
    async create(@Body() data: CreateFileDto) {
        return await this.fileService.createFile(data);
    }

    @Post('/bulk')
    @HttpCode(201)
    async createBulk(@Body() data: BulkCreateFileDto) {
        return await this.fileService.createBulkFiles(data.files);
    }

    @Delete('/:id')
    async remove(@Param('id') id: string) {
        return await this.fileService.deleteFile(id);
    }

    @Put('/:id')
    async update(
        @Param('id') id: string,
        @Body() data: UpdateFileDto
    ) {
        return await this.fileService.updateFile(id, data);
    }

    @Put('/bulk')
    async updateBulk(@Body() data: BulkUpdateFileDto[]) {
        return await this.fileService.updateBulkFiles(data);
    }

    @Post('/search')
    async search(@Body() data: SearchFileDto) {
        return await this.fileService.searchFiles(data.searchTerm);
    }

    @Delete('/bulk')
    async removeBulk(@Body() data: BulkDeleteFileDto) {
        return await this.fileService.deleteBulkFiles(data.ids);
    }


    @Post('/upload/bulk')
    @UseBefore(uploadConfig.array('files'))
    @HttpCode(201)
    async uploadMultiple(@Req() req: any, @Body() data: { folder_id: string }) {
        try {
            const files = req.files;
            if (!files || files.length === 0) {
                throw new Error('No files uploaded');
            }

            const filePromises = files.map(async (file: Express.Multer.File) => {
                const relativePath = path.relative(
                    path.join(process.cwd(), 'uploads'),
                    file.path
                );

                return this.fileService.createFile({
                    name: file.originalname,
                    folder_id: data.folder_id,
                    mime_type: file.mimetype,
                    size: file.size,
                    physical_path: relativePath
                });
            });

            const results = await Promise.all(filePromises);
            return {
                message: 'Files uploaded successfully',
                files: results
            };
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    }
} 