import type { Request, Response } from 'express';
import 'reflect-metadata';
import { Controller, Param, Body, Get, Post, Put, Delete, JsonController, Res } from 'routing-controllers';

@JsonController()
export class FolderController {
    @Get('/folders')
    getAll(@Res() res: Response) {
        return res.send('All Folders')
    }
}