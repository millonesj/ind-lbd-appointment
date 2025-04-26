import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './infraestructure/config/configuration';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './infraestructure/config/swagger.config';
import { AllExceptionsFilter } from './infraestructure/exception-filters/all-exceptions.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const { port } = config();
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  await app.listen(port).then(() => {
    console.log(`Application is running on port ${port}`);
  });
}
bootstrap();
