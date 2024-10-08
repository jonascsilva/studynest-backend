import { Test, TestingModule } from '@nestjs/testing'

import { AuthService } from '$/users/auth.service'
import { UsersController } from '$/users/users.controller'
import { UsersService } from '$/users/users.service'

import { AuthServiceMock } from './auth.service.mock'
import { UsersServiceMock } from './users.service.mock'

describe('UsersController', () => {
  let usersController: UsersController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useClass: UsersServiceMock
        },
        {
          provide: AuthService,
          useClass: AuthServiceMock
        }
      ]
    }).compile()

    usersController = module.get<UsersController>(UsersController)
  })

  it('should be defined', () => {
    expect(usersController).toBeDefined()
  })
})
