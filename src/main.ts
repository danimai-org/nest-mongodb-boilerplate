import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { createApplication, documentationBuilder } from './utils/bootstrap';
import * as morgan from 'morgan';
import { RolesGuard } from './modules/auth/guards/roles.guard';

async function bootstrap() {
  let app = await NestFactory.create(AppModule);
  app = createApplication(app);

  const configService = app.get(ConfigService);
  app.enableCors({ origin: 'http://127.0.0.1:3000' });
  app.use(morgan('dev'));
  documentationBuilder(app, configService);
  await app.listen(configService.get('app.port'));
}
void bootstrap();
