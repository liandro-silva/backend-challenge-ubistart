import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get<EnvironmentVariables>(ConfigService);
  app.use(helmet);
  app.use(csurf());
  await app.listen(configService.port);
}
bootstrap();
