import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { instance, mock, when, verify, anything } from 'ts-mockito'

import { AuthService } from '$/users/auth.service'
import { HashService } from '$/users/hash.service'
import { User } from '$/users/user.entity'
import { UsersService } from '$/users/users.service'

describe('AuthService', () => {
  let authService: AuthService
  let usersServiceMock: UsersService
  let hashServiceMock: HashService

  beforeEach(async () => {
    usersServiceMock = mock(UsersService)
    hashServiceMock = mock(HashService)

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: instance(usersServiceMock)
        },
        {
          provide: HashService,
          useValue: instance(hashServiceMock)
        }
      ]
    }).compile()

    authService = module.get<AuthService>(AuthService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(authService).toBeDefined()
  })

  describe('signup', () => {
    it('should throw BadRequestException if email is already in use', async () => {
      const email = 'test@example.com'
      const password = 'password123'

      const existingUser = new User()
      existingUser.id = 'user-id'
      existingUser.email = email
      existingUser.password = 'hashedpassword'

      when(usersServiceMock.find(email)).thenResolve([existingUser])

      await expect(authService.signup(email, password)).rejects.toThrow(BadRequestException)

      verify(usersServiceMock.find(email)).once()
      verify(usersServiceMock.create(anything(), anything())).never()
      verify(hashServiceMock.hash(anything())).never()
    })

    it('should create a new user with hashed password', async () => {
      const email = 'test@example.com'
      const password = 'password123'
      const hashedPassword = 'hashedpassword'

      when(usersServiceMock.find(email)).thenResolve([])

      when(hashServiceMock.hash(password)).thenResolve(hashedPassword)

      const createdUser = new User()
      createdUser.id = 'user-id'
      createdUser.email = email
      createdUser.password = hashedPassword

      when(usersServiceMock.create(email, hashedPassword)).thenResolve(createdUser)

      const result = await authService.signup(email, password)

      expect(result).toEqual(createdUser)

      verify(usersServiceMock.find(email)).once()
      verify(hashServiceMock.hash(password)).once()
      verify(usersServiceMock.create(email, hashedPassword)).once()
    })
  })

  describe('signin', () => {
    it('should throw NotFoundException if user is not found', async () => {
      const email = 'test@example.com'
      const password = 'password123'

      when(usersServiceMock.find(email)).thenResolve([])

      await expect(authService.signin(email, password)).rejects.toThrow(NotFoundException)

      verify(usersServiceMock.find(email)).once()
      verify(hashServiceMock.verify(anything(), anything())).never()
    })

    it('should throw BadRequestException if password is incorrect', async () => {
      const email = 'test@example.com'
      const password = 'wrongpassword'
      const hashedPassword = 'hashedpassword'

      const user = new User()
      user.id = 'user-id'
      user.email = email
      user.password = hashedPassword

      when(usersServiceMock.find(email)).thenResolve([user])

      when(hashServiceMock.verify(hashedPassword, password)).thenResolve(false)

      await expect(authService.signin(email, password)).rejects.toThrow(BadRequestException)

      verify(usersServiceMock.find(email)).once()
      verify(hashServiceMock.verify(hashedPassword, password)).once()
    })

    it('should return user if credentials are correct', async () => {
      const email = 'test@example.com'
      const password = 'correctpassword'
      const hashedPassword = 'hashedpassword'

      const user = new User()
      user.id = 'user-id'
      user.email = email
      user.password = hashedPassword

      when(usersServiceMock.find(email)).thenResolve([user])

      when(hashServiceMock.verify(hashedPassword, password)).thenResolve(true)

      const result = await authService.signin(email, password)

      expect(result).toEqual(user)

      verify(usersServiceMock.find(email)).once()
      verify(hashServiceMock.verify(hashedPassword, password)).once()
    })
  })
})
