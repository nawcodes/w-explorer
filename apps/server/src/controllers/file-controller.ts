import type { Request, Response } from 'express';
import 'reflect-metadata';
import { Controller, Param, Body, Get, Post, Put, Delete, JsonController, Res, HttpCode } from 'routing-controllers';
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
} 