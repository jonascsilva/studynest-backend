import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { instance, mock, when, verify, deepEqual } from 'ts-mockito'

import { AuthService } from '$/users/auth.service'
import { CreateUserDto } from '$/users/dtos/create-user.dto'
import { UpdateUserDto } from '$/users/dtos/update-user.dto'
import { User } from '$/users/user.entity'
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

  describe('createUser', () => {
    it('should create a new user via authService.signup', async () => {
      const body: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123'
      }

      const user = new User()
      user.id = 'some-id'
      user.email = body.email
      user.password = body.password

      when(authServiceMock.signup(body.email, body.password)).thenResolve(user)

      const result = await usersController.createUser(body)

      expect(result).toEqual(user)
      verify(authServiceMock.signup(body.email, body.password)).once()
    })
  })

  describe('signin', () => {
    it('should sign in a user via authService.signin', async () => {
      const body: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123'
      }

      const user = new User()
      user.id = 'some-id'
      user.email = body.email
      user.password = body.password

      when(authServiceMock.signin(body.email, body.password)).thenResolve(user)

      const result = await usersController.signin(body)

      expect(result).toEqual(user)
      verify(authServiceMock.signin(body.email, body.password)).once()
    })
  })

  describe('findUser', () => {
    it('should return the user if found', async () => {
      const id = 'some-id'
      const user = new User()
      user.id = id

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
    it('should return all users matching the email', async () => {
      const email = 'test@example.com'
      const users = [new User(), new User()]
      users[0].email = email
      users[1].email = email

      when(usersServiceMock.find(email)).thenResolve(users)

      const result = await usersController.findAllUsers(email)

      expect(result).toEqual(users)
      verify(usersServiceMock.find(email)).once()
    })
  })

  describe('removeUser', () => {
    it('should remove the user via usersService.remove', async () => {
      const id = 'some-id'
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
      const id = 'some-id'
      const body: UpdateUserDto = {
        email: 'newemail@example.com'
      }
      const updatedUser = new User()
      updatedUser.id = id
      updatedUser.email = body.email

      when(usersServiceMock.update(id, deepEqual(body))).thenResolve(updatedUser)

      const result = await usersController.updateUser(id, body)

      expect(result).toEqual(updatedUser)
      verify(usersServiceMock.update(id, deepEqual(body))).once()
    })
  })
})
