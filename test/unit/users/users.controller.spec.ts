import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { instance, mock, when, verify, deepEqual } from 'ts-mockito'

import { UpdateUserDto } from '$/users/dtos/update-user.dto'
import { User } from '$/users/user.entity'
import { UsersController } from '$/users/users.controller'
import { UsersService } from '$/users/users.service'

describe('UsersController', () => {
  let usersController: UsersController
  let usersServiceMock: UsersService

  beforeEach(async () => {
    usersServiceMock = mock(UsersService)

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: instance(usersServiceMock)
        }
      ]
    }).compile()

    usersController = module.get<UsersController>(UsersController)
  })

  it('should be defined', () => {
    expect(usersController).toBeDefined()
  })

  describe('getProfile', () => {
    it('should return the user profile from the request', () => {
      const req = {
        user: {
          id: 'user-id',
          email: 'test@example.com',
          name: 'Test User'
        }
      }

      const result = usersController.getProfile(req)

      expect(result).toEqual(req.user)
    })
  })

  describe('findUser', () => {
    it('should return the user if found', async () => {
      const id = 'user-id'
      const user = new User()
      user.id = id
      user.email = 'test@example.com'

      when(usersServiceMock.findOne(id)).thenResolve(user)

      const result = await usersController.findUser(id)

      expect(result).toEqual(user)
      verify(usersServiceMock.findOne(id)).once()
    })

    it('should throw NotFoundException if user not found', async () => {
      const id = 'non-existent-id'

      when(usersServiceMock.findOne(id)).thenResolve(null)

      await expect(usersController.findUser(id)).rejects.toThrow(NotFoundException)
      verify(usersServiceMock.findOne(id)).once()
    })
  })

  describe('findAllUsers', () => {
    it('should return all users matching the email query', async () => {
      const email = 'test@example.com'
      const users = [new User(), new User()]
      users[0].email = email
      users[1].email = email

      when(usersServiceMock.find(email)).thenResolve(users)

      const result = await usersController.findAllUsers(email)

      expect(result).toEqual(users)
      verify(usersServiceMock.find(email)).once()
    })

    it('should return all users when no email query is provided', async () => {
      const users = [new User(), new User()]
      users[0].email = 'user1@example.com'
      users[1].email = 'user2@example.com'

      when(usersServiceMock.find(undefined)).thenResolve(users)

      const result = await usersController.findAllUsers(undefined)

      expect(result).toEqual(users)
      verify(usersServiceMock.find(undefined)).once()
    })
  })

  describe('removeUser', () => {
    it('should remove the user via usersService.remove', async () => {
      const id = 'user-id'
      const user = new User()
      user.id = id

      when(usersServiceMock.remove(id)).thenResolve(user)

      const result = await usersController.removeUser(id)

      expect(result).toEqual(user)
      verify(usersServiceMock.remove(id)).once()
    })
  })

  describe('updateUser', () => {
    it('should update the user via usersService.update', async () => {
      const id = 'user-id'
      const body: UpdateUserDto = {
        email: 'newemail@example.com',
        name: 'New Name'
      }
      const updatedUser = new User()
      updatedUser.id = id
      updatedUser.email = body.email
      updatedUser.name = body.name

      when(usersServiceMock.update(id, deepEqual(body))).thenResolve(updatedUser)

      const result = await usersController.updateUser(id, body)

      expect(result).toEqual(updatedUser)
      verify(usersServiceMock.update(id, deepEqual(body))).once()
    })
  })
})
