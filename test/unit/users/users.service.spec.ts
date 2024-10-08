import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { User } from '$/users/user.entity'
import { UsersService } from '$/users/users.service'

import { UsersRepositoryMock } from './users.repository.mock'

describe('UsersService', () => {
  let usersService: UsersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: UsersRepositoryMock
        }
      ]
    }).compile()

    usersService = module.get<UsersService>(UsersService)
  })

  it('should be defined', () => {
    expect(usersService).toBeDefined()
  })
})
