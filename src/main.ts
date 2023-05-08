import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './commons/filter/http-exception.filter';
import { graphqlUploadExpress } from 'graphql-upload';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // for validation
  app.useGlobalFilters(new HttpExceptionFilter()); // for exception
  app.use(graphqlUploadExpress()); // for upload
  await app.listen(3000);
}
bootstrap();
