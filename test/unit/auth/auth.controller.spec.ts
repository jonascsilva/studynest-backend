import { Test, TestingModule } from '@nestjs/testing'
import { instance, mock, when, verify } from 'ts-mockito'

import { AuthController } from '$/auth/auth.controller'
import { AuthService } from '$/auth/auth.service'
import { CreateUserDto } from '$/auth/dtos/create-user.dto'

describe('AuthController', () => {
  let authController: AuthController
  let authServiceMock: AuthService

  beforeEach(async () => {
    authServiceMock = mock(AuthService)

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: instance(authServiceMock)
        }
      ]
    }).compile()

    authController = module.get<AuthController>(AuthController)
  })

  it('should be defined', () => {
    expect(authController).toBeDefined()
  })

  describe('signup', () => {
    it('should register a new user and return a success message', async () => {
      const body: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test'
      }

      const response = { access_token: 'fake-token' }

      when(authServiceMock.signup(body.email, body.password, body.name)).thenResolve(response)

      const result = await authController.signup(body)

      expect(result).toEqual(response)

      verify(authServiceMock.signup(body.email, body.password, body.name)).once()
    })
  })

  describe('signin', () => {
    it('should authenticate the user and return an access token', async () => {
      const body: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123'
      }

      const authResult = {
        access_token: 'fake-jwt-token'
      }

      when(authServiceMock.signin(body.email, body.password)).thenResolve(authResult)

      const result = await authController.signin(body)

      expect(result).toEqual(authResult)

      verify(authServiceMock.signin(body.email, body.password)).once()
    })
  })
})
