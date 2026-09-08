import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Cookie parser
  app.use(cookieParser());

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Nest.js Ecommerce API')
    .setDescription('A simple Ecommrce API')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
