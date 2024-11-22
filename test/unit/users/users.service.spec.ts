import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { instance, mock, when, verify, anything, deepEqual } from 'ts-mockito'
import { Repository } from 'typeorm'

import { User } from '$/users/user.entity'
import { UsersService } from '$/users/users.service'

describe('UsersService', () => {
  let usersService: UsersService
  let userRepoMock: Repository<User>

  beforeEach(async () => {
    userRepoMock = mock(Repository<User>)

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: instance(userRepoMock)
        }
      ]
    }).compile()

    usersService = module.get<UsersService>(UsersService)
  })

  it('should be defined', () => {
    expect(usersService).toBeDefined()
  })

  describe('create', () => {
    it('should create and save a new user', async () => {
      const email = 'test@example.com'
      const password = 'password123'
      const name = 'Test'

      const createUserInput = { email, password, name, userSettings: {} }

      const user = new User()

      user.email = email
      user.password = password

      when(userRepoMock.create(deepEqual(createUserInput))).thenReturn(user)
      when(userRepoMock.save(user)).thenResolve(user)

      const result = await usersService.create(email, password, name)

      expect(result).toEqual(user)

      verify(userRepoMock.create(deepEqual(createUserInput))).once()
      verify(userRepoMock.save(user)).once()
    })
  })

  describe('findOne', () => {
    it('should find a user by id', async () => {
      const id = 'some-id'
      const user = new User()
      user.id = id

      when(userRepoMock.findOneBy(deepEqual({ id }))).thenResolve(user)

      const result = await usersService.findOne(id)

      expect(result).toEqual(user)

      verify(userRepoMock.findOneBy(deepEqual({ id }))).once()
    })

    it('should return null if user is not found', async () => {
      const id = 'non-existent-id'

      when(userRepoMock.findOneBy(deepEqual({ id }))).thenResolve(null)

      const result = await usersService.findOne(id)

      expect(result).toBeNull()
      verify(userRepoMock.findOneBy(deepEqual({ id }))).once()
    })
  })

  describe('find', () => {
    it('should find users by email', async () => {
      const email = 'test@example.com'
      const users = [new User(), new User()]
      users[0].email = email
      users[1].email = email

      when(userRepoMock.findBy(deepEqual({ email }))).thenResolve(users)

      const result = await usersService.find(email)

      expect(result).toEqual(users)

      verify(userRepoMock.findBy(deepEqual({ email }))).once()
    })
  })

  describe('update', () => {
    it('should update and save a user', async () => {
      const id = 'some-id'
      const attrs: Partial<User> = { email: 'newemail@example.com' }
      const user = new User()
      user.id = id
      user.email = 'test@example.com'
      user.password = 'oldpassword'

      when(userRepoMock.findOneBy(deepEqual({ id }))).thenResolve(user)
      when(userRepoMock.findOneBy(deepEqual({ email: attrs.email }))).thenResolve(null)
      when(userRepoMock.save(anything())).thenResolve(user)

      const result = await usersService.update(id, attrs)

      expect(result).toEqual(user)
      expect(user.email).toEqual(attrs.email)
      verify(userRepoMock.findOneBy(deepEqual({ id }))).once()
      verify(userRepoMock.findOneBy(deepEqual({ email: attrs.email }))).once()
      verify(userRepoMock.save(user)).once()
    })

    it('should throw NotFoundException if user not found', async () => {
      const id = 'non-existent-id'
      const attrs: Partial<User> = { email: 'newemail@example.com' }

      when(userRepoMock.findOneBy(deepEqual({ id }))).thenResolve(null)

      await expect(usersService.update(id, attrs)).rejects.toThrow(NotFoundException)

      verify(userRepoMock.findOneBy(deepEqual({ id }))).once()
      verify(userRepoMock.save(anything())).never()
    })

    it('should throw BadRequestException if new email is already in use', async () => {
      const id = 'some-id'
      const attrs: Partial<User> = { email: 'existing@example.com' }
      const user = new User()
      user.id = id
      user.email = 'test@example.com'

      const existingUser = new User()
      existingUser.id = 'another-id'
      existingUser.email = attrs.email

      when(userRepoMock.findOneBy(deepEqual({ id }))).thenResolve(user)
      when(userRepoMock.findOneBy(deepEqual({ email: attrs.email }))).thenResolve(existingUser)

      await expect(usersService.update(id, attrs)).rejects.toThrow(BadRequestException)

      verify(userRepoMock.findOneBy(deepEqual({ id }))).once()
      verify(userRepoMock.findOneBy(deepEqual({ email: attrs.email }))).once()
      verify(userRepoMock.save(anything())).never()
    })
  })

  describe('remove', () => {
    it('should remove a user', async () => {
      const id = 'some-id'
      const user = new User()
      user.id = id

      when(userRepoMock.findOneBy(deepEqual({ id }))).thenResolve(user)
      when(userRepoMock.remove(user)).thenResolve(user)

      const result = await usersService.remove(id)

      expect(result).toEqual(user)

      verify(userRepoMock.findOneBy(deepEqual({ id }))).once()
      verify(userRepoMock.remove(user)).once()
    })

    it('should throw NotFoundException if user not found', async () => {
      const id = 'non-existent-id'

      when(userRepoMock.findOneBy(deepEqual({ id }))).thenResolve(null)

      await expect(usersService.remove(id)).rejects.toThrow(NotFoundException)

      verify(userRepoMock.findOneBy(deepEqual({ id }))).once()
      verify(userRepoMock.remove(anything())).never()
    })
  })
})
