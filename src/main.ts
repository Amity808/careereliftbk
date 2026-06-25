import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // set global api prefix (e.g., /api/v1)

  app.setGlobalPrefix('api/v1')

  app.enableCors();

  // register global validation pipe for request DTOs
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true })
  );

  // register global interceptors and filters
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter())
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
