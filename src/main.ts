import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { logger } from './logger/logger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger API documentation setup
  const config = new DocumentBuilder()
    .setTitle('UZ Pay SDK')
    .setDescription(
      `
      Universal Payment Gateway for Uzbekistan
      
      ### Supported Payment Providers:
      - **Payme** - Leading payment system in Uzbekistan
      - **Click** - Popular mobile payment platform  
      - **UzCard** - National payment card system
      - **Humo** - Bank card payment system
      - **Apelsin** - Digital wallet and payment platform
      
      ### Features:
      - ✅ Universal API for all providers
      - ✅ Professional logging with Winston
      - ✅ Webhook support for real-time notifications
      - ✅ Type-safe TypeScript SDK
      - ✅ Comprehensive error handling
      - ✅ Production-ready architecture
    `,
    )
    .setVersion('1.0.0')
    .addTag('payments', 'Payment operations for all providers')
    .addTag('webhooks', 'Webhook endpoints for payment notifications')
    .setContact(
      'Umirbayev Ilnur',
      'https://github.com/Ilnur72/uz-pay-sdk',
      'umirbayev72@gmail.com',
    )
    .setLicense(
      'MIT',
      'https://github.com/Ilnur72/uz-pay-sdk/blob/main/LICENSE',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'UZ Pay SDK - API Documentation',
    customfavIcon: '🚀',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3000;
  const environment = process.env.NODE_ENV || 'development';

  await app.listen(port);

  logger.info('🚀 UZ Pay SDK server started', {
    port,
    environment,
    url: `http://localhost:${port}`,
    timestamp: new Date().toISOString(),
  });

  console.log(`🚀 UZ Pay SDK server ishga tushdi: http://localhost:${port}`);
  console.log(`📋 Environment: ${environment}`);
}

bootstrap().catch((error) => {
  logger.error('Application failed to start', {
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  });

  console.error('❌ Server ishga tushmadi:', error);
  process.exit(1);
});
