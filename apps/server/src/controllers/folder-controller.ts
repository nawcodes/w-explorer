import type { Request, Response } from 'express';
import 'reflect-metadata';
import { Controller, Param, Body, Get, Post, Put, Delete, JsonController, Res, HttpCode, QueryParam, QueryParams } from 'routing-controllers';
import { FolderService } from '../services/folder-service';
import {
    CreateFolderDto,
    UpdateFolderDto,
    BulkCreateFolderDto,
    BulkUpdateFolderDto,
    SearchFolderDto,
    BulkDeleteFolderDto
} from '../dtos/folder.dto';
import { Service } from 'typedi';

@JsonController('/folders')
@Service()
export class FolderController {
    private folderService: FolderService;

    constructor() {
        this.folderService = new FolderService();
    }

    @Get()
    async getAll() {
        return await this.folderService.getAllFolders();
    }

    @Get('/:id')
    async getOne(@Param('id') id: string) {
        return await this.folderService.getFolderById(id);
    }

    @Get('/:id/subfolders')
    async getSubfolders(@Param('id') id: string) {
        return await this.folderService.getDirectSubfolders(id);
    }

    @Post()
    @HttpCode(201)
    async create(@Body() data: CreateFolderDto) {
        return await this.folderService.createFolder(data);
    }

    @Delete('/:id')
    async remove(@Param('id') id: string) {
        return await this.folderService.deleteFolder(id);
    }

    @Put('/:id')
    async update(
        @Param('id') id: string,
        @Body() data: UpdateFolderDto
    ) {
        return await this.folderService.updateFolder(id, data);
    }

    @Post('/bulk')
    async createBulk(@Body() data: BulkCreateFolderDto) {
        return await this.folderService.createBulkFolders(data.folders);
    }

    @Put('/bulk')
    async updateBulk(@Body() data: BulkUpdateFolderDto[]) {
        return await this.folderService.updateBulkFolders(data);
    }

    @Post('/search')
    async search(@Body() data: SearchFolderDto) {
        return await this.folderService.searchFolders(data.searchTerm);
    }

    @Delete('/bulk')
    async removeBulk(@Body() data: BulkDeleteFolderDto) {
        return await this.folderService.deleteBulkFolders(data.ids);
    }

    @Get(':id/contents')
    async getFolderContents(@Param('id') id: string) {
        return await this.folderService.getFolderContents(id)
    }

    @Post('/by-path')
    async getFolderByPath(@Body() data: { path: string }) {
        console.log(data);

        if (!data.path) {
            throw new Error('Path is required')
        }

        // Cari folder berdasarkan nama
        const folder = await this.folderService.getFolderByPath(data.path)

        if (!folder) {
            throw new Error(`Folder ${data.path} not found`)
        }

        return folder
    }
}