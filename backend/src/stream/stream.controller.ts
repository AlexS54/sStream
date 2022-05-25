import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { StreamService } from './stream.service';
import { Request, Response } from "express";
import { SongStreamQueryParams } from "../entities";

@Controller("song-stream")
export class StreamController {
    constructor(private readonly streamService: StreamService) {}

    @Get()
    public getSongStream(@Query() query: SongStreamQueryParams, @Req() req: Request, @Res() res: Response): Promise<void> {
        return this.streamService.pipeSongStream(query.id, req, res);
    }
}
