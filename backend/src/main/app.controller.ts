import {
    Body,
    Controller,
    Delete,
    Get,
    Headers, Param,
    Patch,
    Post,
    Query,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
import { RatingService } from "./rating.service";
import { IHeaders, SongStreamQueryParams, UploadSongRequest } from "../entities"

@Controller("songs")
export class AppController {
    constructor(
        private readonly uploadService: UploadService,
        private readonly ratingService: RatingService
    ) {}

    @Get()
    public getAllSongs(@Headers() headers: IHeaders) {
        return this.uploadService.getAllSongs(headers.authorization);
    }

    @Post("upload")
    @UseInterceptors(FileInterceptor("file"))
    public uploadSong(@Headers() headers: IHeaders, @Body() body: UploadSongRequest, @UploadedFile() file: Express.Multer.File): Promise<any> {
        return this.uploadService.uploadSong(body, headers.authorization, file);
    }

    @Patch(":id/like")
    public likeSong(@Headers() headers: IHeaders, @Param("id") id: string): Promise<any> {
        return this.ratingService.likeSong(headers.authorization, id);
    }

    @Patch(":id/dislike")
    public dislikeSong(@Headers() headers: IHeaders, @Param("id") id: string): Promise<void> {
        return this.ratingService.dislikeSong(headers.authorization, id);
    }

    @Delete(":id/like")
    public removeLike(@Headers() headers: IHeaders, @Param("id") id: string): Promise<void> {
        return this.ratingService.removeLike(headers.authorization, id);
    }

    @Delete(":id/dislike")
    public removeDislike(@Headers() headers: IHeaders, @Param("id") id: string): Promise<void> {
        return this.ratingService.removeDislike(headers.authorization, id);
    }
}
