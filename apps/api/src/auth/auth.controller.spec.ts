import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { UserLoginDto, UserRegistrationDto } from '@area/shared';
import { APP_PIPE } from '@nestjs/core';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
          },
        },
        {
          provide: APP_PIPE,
          useClass: ValidationPipe,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should return a token on successful login', async () => {
    const loginDto: UserLoginDto = {
      email: 'test@example.com',
      password: 'password',
    };
    const token = 'testToken';
    jest.spyOn(authService, 'login').mockResolvedValue({ token });

    const result = await authController.login(loginDto);

    expect(authService.login).toHaveBeenCalledWith(loginDto);
    expect(result).toEqual({ token });
  });

  it('should return a token on successful registration', async () => {
    const registerDto: UserRegistrationDto = {
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      password: 'password',
    };
    const token = 'testToken';
    jest.spyOn(authService, 'register').mockResolvedValue({ token });

    const result = await authController.register(registerDto);

    expect(authService.register).toHaveBeenCalledWith(registerDto);
    expect(result).toEqual({ token });
  });
});
