import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));

  const config = new DocumentBuilder()
    .setTitle('API con vulnerabilidades de seguridad')
    .setDescription('')
    .setVersion('')
    .addTag('')
    .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
