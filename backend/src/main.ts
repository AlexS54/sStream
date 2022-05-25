import { NestFactory } from '@nestjs/core';
import { AppModule } from './main/app.module';
import { config } from "./config";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({ origin: "*" });
    await app.listen(config.mainServicePort);
}

bootstrap().then(() => console.log("Main Service is running on port " + config.mainServicePort));
