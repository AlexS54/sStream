import { NestFactory } from '@nestjs/core';
import { StreamModule } from './stream/stream.module';
import { config } from "./config";

async function bootstrap() {
    const app = await NestFactory.create(StreamModule);
    app.enableCors({ origin: "*" });
    await app.listen(config.streamServicePort);
}

bootstrap().then(() => console.log("Stream Service is running on port " + config.streamServicePort));
