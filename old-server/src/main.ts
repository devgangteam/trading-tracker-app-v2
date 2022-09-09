import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger: Logger = new Logger(AppModule.name);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(helmet());

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get<ConfigService>(ConfigService);
  const whiteList = [configService.get('clientUrl'), configService.get('adminUrl')];

  app.enableCors({
    credentials: true,
    origin: function (origin, callback) {
      if (!origin || whiteList.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  });

  const port = configService.get('port');
  await app.listen(port, () => logger.log(`Server is listening on port: ${port}`));
}
bootstrap();
