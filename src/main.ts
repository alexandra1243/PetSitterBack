import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';

import { MongooseExceptionFilter } from '@common/filters/mongoose-exception.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validationError: {
        target: false,
        value: false
      },
      exceptionFactory: (errors: ValidationError[] = []) =>
        new BadRequestException(errors)
    })
  );

  app.useGlobalFilters(new MongooseExceptionFilter());

  const options = new DocumentBuilder()
    .setTitle('Pet Sitter')
    .setDescription('Pet Sitter')
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  
  const port = process.env.SERVER_PORT || 4000;
  console.log(`App is running on port ${port}`);
  
  await app.listen(port);
}

bootstrap();