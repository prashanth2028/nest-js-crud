import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { swaggerConfig } from './utils/SwaggerConfig';
import { ResponseInterceptor } from './utils/ResponseInterceptor';
import { ExceptionHandler } from './utils/ExceptionHandler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(new ResponseInterceptor());
  
  // Apply the global exception filter
  app.useGlobalFilters(new ExceptionHandler());

  // Enable CORS
  app.enableCors();

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: false,
      forbidNonWhitelisted: false,
    }),
  );

  app.use(cookieParser());

  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.listen(process.env.PORT);
}
bootstrap();
