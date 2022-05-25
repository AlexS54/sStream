import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from "uuid";
import { config } from "../config";
import { getJWTData } from "../utils";
import { Datastore } from "@google-cloud/datastore";
import { Storage } from "@google-cloud/storage";
import { Song } from "../entities";

@Injectable()
export class UploadService {
    constructor(
        @Inject("GoogleCloudStorage") private readonly storage: Storage,
        @Inject("Datastore") private readonly datastore: Datastore
    ) {}

    public async uploadSong(body, bearerToken, file) {
        if (!file) {
            throw new BadRequestException("No file was provided");
        }
        const fileId = this.uploadFile(file.buffer);
        await this.saveEntityToDB(body, bearerToken, fileId);
        return { fileId };
    }

    public async getAllSongs(bearerToken: string): Promise<Song[]> {
        const { email } = getJWTData(bearerToken);
        const query = this.datastore.createQuery(config.datastoreKind);
        const [songs] = await this.datastore.runQuery(query);
        return songs.map(song => {
            return {
                title: song.title,
                fileId: song.fileId,
                email: song.email,
                likes: song.likedBy.length,
                dislikes: song.dislikedBy.length,
                isLiked: song.likedBy.includes(email),
                isDisliked: song.dislikedBy.includes(email)
            };
        });
    }

    private uploadFile(fileBuffer) {
        const fileId = `${uuidv4()}.mp3`;
        const bucket = this.storage.bucket(config.bucketName);
        const blob = bucket.file(fileId);
        const blobStream = blob.createWriteStream();

        blobStream.on("error", err => {
            console.log(err);
            throw err;
        });

        blobStream.on("finish", () => {
            console.log(`Uploaded song ${fileId}`);
        });

        blobStream.end(fileBuffer);

        return fileId;
    }

    private async saveEntityToDB(body, bearerToken, fileId) {
        const { email } = getJWTData(bearerToken);
        const key = this.datastore.key([config.datastoreKind, fileId]);
        const songEntity = {
            key,
            data: {
                title: body.title,
                fileId,
                email,
                likedBy: [],
                dislikedBy: []
            }
        };
        await this.datastore.save(songEntity);
    }
}
