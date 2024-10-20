import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { instance, mock } from 'ts-mockito'
import { Repository } from 'typeorm'

import { User } from '$/users/user.entity'
import { UsersService } from '$/users/users.service'

describe('UsersService', () => {
  let usersService: UsersService
  let userRepositoryMock: Repository<User>

  beforeEach(async () => {
    userRepositoryMock = mock(Repository<User>)

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: instance(userRepositoryMock)
        }
      ]
    }).compile()

    usersService = module.get<UsersService>(UsersService)
  })

  it('should be defined', () => {
    expect(usersService).toBeDefined()
  })
})
