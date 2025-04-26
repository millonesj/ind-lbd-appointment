import { DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';

export const swaggerConfig: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
  .setTitle('API Codechallenge')
  .setDescription('Endpoints about external APIs')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
