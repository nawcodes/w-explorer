import type { Request, Response } from 'express';
import 'reflect-metadata';
import { Controller, Param, Body, Get, Post, Put, Delete, JsonController, Res } from 'routing-controllers';
import { FolderService } from '../services/folder-service';

@JsonController()
export class FolderController {
    @Get('/folders')
    getAll(@Res() res: Response) {
        return new FolderService().getAllFolders()
    }
}