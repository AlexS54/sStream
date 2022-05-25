import { Injectable } from '@nestjs/common';
import { Request, Response } from "express";
import { config } from "../config";

@Injectable()
export class StreamService {
    public async pipeSongStream(fileName: string, req: Request, res: Response): Promise<void> {
        const storage = new Storage();
        const videoRange = req.headers.range;
        const file = storage.bucket(config.bucketName).file(fileName);
        const fileSize = (await file.getMetadata())[0].size;
        if (videoRange) {
            const parts = videoRange.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1]
                ? parseInt(parts[1], 10)
                : fileSize - 1;
            const chunkSize = (end - start) + 1;
            const stream = file.createReadStream({ start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Type': 'audio/mpeg',
            };
            res.writeHead(206, head);
            stream.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'audio/mpeg',
            };
            res.writeHead(200, head);
            file.createReadStream().pipe(res);
        }
    }
}
