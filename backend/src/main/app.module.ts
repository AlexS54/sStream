import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UploadService } from './upload.service';
import { RatingService } from "./rating.service";
import { Storage } from "@google-cloud/storage";
import { Datastore } from "@google-cloud/datastore";

@Module({
    controllers: [AppController],
    providers: [
        UploadService,
        RatingService,
        {
            provide: "GoogleCloudStorage",
            useValue: new Storage()
        },
        {
            provide: "Datastore",
            useValue: new Datastore()
        }
    ]
})
export class AppModule {}
