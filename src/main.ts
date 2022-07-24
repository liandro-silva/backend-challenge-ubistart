import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import compression from 'compression';

import helmet from 'helmet';
import { VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  const configService = app.get(ConfigService);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.use(compression());
  app.use(helmet());
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  const config = new DocumentBuilder()
    .setTitle('TODOLIST')
    .setDescription('API created to solve Ubistart backend challenge')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customCss: `.topbar-wrapper img {
      content:url(\'/logo-ubistart.png\'); width:300px; height:auto;
    }
    .swagger-ui .topbar {
      background-color: black;
      padding: 25px 0 !important;
    }

    .download-url-wrapper {
      display: none;
    }
    `,
  });
  await app.listen(configService.get('port'));
}
bootstrap();
