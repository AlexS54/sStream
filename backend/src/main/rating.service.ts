import { Inject, Injectable } from '@nestjs/common';
import { getJWTData } from "../utils";
import { Datastore } from "@google-cloud/datastore";
import { config } from "../config";

@Injectable()
export class RatingService {
    constructor(@Inject("Datastore") private readonly datastore: Datastore) {}

    public async likeSong(bearerToken: string, fileId: string): Promise<void> {
        const { email } = getJWTData(bearerToken);
        const transaction = this.datastore.transaction();
        const songKey = this.datastore.key([config.datastoreKind, fileId]);
        try {
            await transaction.run();
            const [song] = await transaction.get(songKey);
            if (song.likedBy.includes(email)) {
                return;
            }
            song.likedBy.push(email);
            song.dislikedBy = song.dislikedBy.filter(user => user !== email);
            transaction.save({
                key: songKey,
                data: song
            });
            await transaction.commit();
            console.log(`Song ${fileId} updated successfully.`);
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    };

    public async dislikeSong(bearerToken: string, fileId: string): Promise<void> {
        const { email } = getJWTData(bearerToken);
        const transaction = this.datastore.transaction();
        const songKey = this.datastore.key([config.datastoreKind, fileId]);
        try {
            await transaction.run();
            const [song] = await transaction.get(songKey);
            if (song.dislikedBy.includes(email)) {
                return;
            }
            song.dislikedBy.push(email);
            song.likedBy = song.likedBy.filter(user => user !== email);
            transaction.save({
                key: songKey,
                data: song
            });
            await transaction.commit();
            console.log(`Song ${fileId} updated successfully.`);
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    };

    public async removeLike(bearerToken: string, fileId: string): Promise<void> {
        const { email } = getJWTData(bearerToken);
        const transaction = this.datastore.transaction();
        const songKey = this.datastore.key([config.datastoreKind, fileId]);
        try {
            await transaction.run();
            const [song] = await transaction.get(songKey);
            if (!song.likedBy.includes(email)) {
                return;
            }
            song.likedBy = song.likedBy.filter(user => user !== email);
            transaction.save({
                key: songKey,
                data: song
            });
            await transaction.commit();
            console.log(`Song ${fileId} updated successfully.`);
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    };

    public async removeDislike(bearerToken: string, fileId: string): Promise<void> {
        const { email } = getJWTData(bearerToken);
        const transaction = this.datastore.transaction();
        const songKey = this.datastore.key([config.datastoreKind, fileId]);
        try {
            await transaction.run();
            const [song] = await transaction.get(songKey);
            if (!song.dislikedBy.includes(email)) {
                return;
            }
            song.dislikedBy = song.dislikedBy.filter(user => user !== email);
            transaction.save({
                key: songKey,
                data: song
            });
            await transaction.commit();
            console.log(`Song ${fileId} updated successfully.`);
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }
}
