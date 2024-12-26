import { DocumentBuilder } from '@nestjs/swagger';

// Swagger configuration
export const swaggerConfig = new DocumentBuilder()
  .setTitle('API Documentation')
  .setDescription('API documentation for The MApp')
  .setVersion('1.0')
  .addBearerAuth() // Optional: Add authentication method
  .build();
