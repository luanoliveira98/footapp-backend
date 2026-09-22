import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EnvService } from './infra/env/env.service';
import cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const config = new DocumentBuilder()
    .setTitle('Footapp API')
    .setDescription('Football simulator and leagues managments engine')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const envService = app.get(EnvService);
  const port = envService.get('PORT');

  app.use(cookieParser());
  app.useLogger(app.get(Logger));

  await app.listen(port);
}
void bootstrap();
