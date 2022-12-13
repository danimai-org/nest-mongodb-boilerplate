import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createApplication } from '../../src/utils/bootstrap';
import { TypeOrmConfigService } from './typeorm-config.service';
import { global_modules, providers } from '../../src/modules/app/app.module';
import { MailerService } from '@nestjs-modules/mailer';

export const createModule = async (modules: any[]) => {
  return await Test.createTestingModule({
    imports: [
      ...global_modules,
      ...modules,
      TypeOrmModule.forRootAsync({
        useClass: TypeOrmConfigService,
      }),
    ],
    providers,
  })
    .overrideProvider(MailerService)
    .useValue({ sendMail: jest.fn() })
    .compile();
};

export const getApplication = async (module: TestingModule) => {
  return createApplication(module.createNestApplication());
};

export const getTestApp = async (modules: any[]) => {
  const module = await createModule(modules);
  const app = await getApplication(module);
  await app.init();
  return app;
};
