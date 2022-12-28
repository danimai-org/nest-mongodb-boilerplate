import { AuthModule } from '../../src/modules/auth/auth.module';
import * as request from 'supertest';
import { getTestApp } from '../utils/moduleCreation';
import {
  TokenType,
  Token,
  UserSession,
  User,
} from '../../src/modules/user/models';
import { faker } from '@faker-js/faker';
import dataSource from '../../ormconfig.test';
import { INestApplication } from '@nestjs/common';

describe('Auth user (e2e)', () => {
  let server: unknown;
  let app: INestApplication;
  let auth_token: string;

  let userDto: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  };

  beforeAll(async () => {
    app = await getTestApp([AuthModule]);
    server = app.getHttpServer();
    userDto = {
      email: faker.internet.email(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      password: 'Password@123',
    };
  }, 50000);

  describe('User auth e2e', () => {
    it('Register with Email: /v1/auth/email/register (POST)', async () => {
      await request(server)
        .post('/v1/auth/email/register')
        .send(userDto)
        .expect(201);

      await request(server)
        .post('/v1/auth/email/register')
        .send({
          email: userDto.email,
          password: '123456789',
        })
        .expect(422);
    });

    it('Verify email: /v1/auth/email/verify (POST)', async () => {
      await request(server)
        .post('/v1/auth/email/verify')
        .send({
          token: 'jsdhksghk',
        })
        .expect(422);

      const token = await dataSource.getRepository(Token).find({
        where: {
          type: TokenType.REGISTER_VERIFY,
        },
      });

      await request(server)
        .post('/v1/auth/email/verify')
        .send({
          verify_token: token[0].token,
        })
        .expect(202);
    });

    it('Login with Email: /v1/auth/email/login (POST)', async () => {
      await request(server)
        .post('/v1/auth/email/login')
        .send({
          email: userDto.email,
          password: '123456789',
        })
        .expect(422);

      const res = await request(server).post('/v1/auth/email/login').send({
        email: userDto.email,
        password: userDto.password,
      });
      expect(res.statusCode).toBe(200);
      auth_token = res.body.auth_token;
    });

    it('Request Reset Password Mail: /v1/auth/email/reset-password-request (POST)', async () => {
      await request(server)
        .post('/v1/auth/email/reset-password-request')
        .send({ email: userDto.email })
        .expect(204);

      await request(server)
        .post('/v1/auth/email/reset-password-request')
        .send({ email: faker.internet.email() })
        .expect(422);
    });

    it('reset Password Using Mail: /v1/auth/reset-password (POST)', async () => {
      const token = await dataSource.getRepository(Token).find({
        where: {
          type: TokenType.RESET_PASSWORD,
        },
      });

      await request(server)
        .post('/v1/auth/reset-password')
        .send({
          password: 'Password@123',
          reset_token: token[0].token,
        })
        .expect(204);

      await request(server)
        .post('/v1/auth/reset-password')
        .send({
          password: 'Password@123',
          token: 'Hash',
        })
        .expect(422);
    });

    it('Log out user: /v1/auth/logout (POST)', async () => {
      await request(server).get('/v1/auth/logout').expect(401);

      await request(server)
        .get('/v1/auth/logout')
        .auth(auth_token, { type: 'bearer' })
        .expect(204);
    });
  });

  afterAll(async () => {
    await dataSource.getRepository(Token).delete({});
    await dataSource.getRepository(UserSession).delete({});
    await dataSource.getRepository(UserSession).delete({});
    await dataSource.getRepository(User).delete({});
    await app.close();
  });
});
