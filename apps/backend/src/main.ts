import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation on all DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // CORS for Expo web and mobile
  app.enableCors({ origin: '*', credentials: true });

  // Swagger at /api
  const config = new DocumentBuilder()
    .setTitle('CampusVault AI API')
    .setDescription('University asset management powered by Amazon Nova')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, config));

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`CampusVault API running on http://localhost:${port}`);
  console.log(`Swagger UI at http://localhost:${port}/api`);
}
bootstrap();
