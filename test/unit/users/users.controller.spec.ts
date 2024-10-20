import { Test, TestingModule } from '@nestjs/testing'
import { instance, mock } from 'ts-mockito'

import { AuthService } from '$/users/auth.service'
import { UsersController } from '$/users/users.controller'
import { UsersService } from '$/users/users.service'

describe('UsersController', () => {
  let usersController: UsersController
  let usersServiceMock: UsersService
  let authServiceMock: AuthService

  beforeEach(async () => {
    usersServiceMock = mock(UsersService)
    authServiceMock = mock(AuthService)

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: instance(usersServiceMock)
        },
        {
          provide: AuthService,
          useValue: instance(authServiceMock)
        }
      ]
    }).compile()

    usersController = module.get<UsersController>(UsersController)
  })

  it('should be defined', () => {
    expect(usersController).toBeDefined()
  })
})
