import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from '../services';
import { EmailController } from './email.controller';
const mockService = {
  register: jest.fn(),
};

describe('EmailController', () => {
  let controller: EmailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailController],
      providers: [EmailService],
    })
      .overrideProvider(EmailService)
      .useValue(mockService)
      .compile();

    controller = module.get<EmailController>(EmailController);
  });

  describe('Register user', () => {
    it('should send a registration verify email', async () => {
      const result = await controller.register({
        email: 'example@danimai.com',
        password: 'Password@123',
        first_name: 'Danimai',
        last_name: 'Mandal',
      });
      expect(result).toBeCalled();
    });
  });
});
