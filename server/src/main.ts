import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true,
    }),
  );

  await app.listen(process.env.PORT);
}
bootstrap();
