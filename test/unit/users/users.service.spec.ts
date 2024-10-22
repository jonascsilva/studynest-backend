import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { instance, mock, when, verify, anything, deepEqual } from 'ts-mockito'
import { Repository } from 'typeorm'

import { User } from '$/users/user.entity'
import { UsersService } from '$/users/users.service'

describe('UsersService', () => {
  let usersService: UsersService
  let usersRepositoryMock: Repository<User>

  beforeEach(async () => {
    usersRepositoryMock = mock(Repository<User>)

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: instance(usersRepositoryMock)
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

      const user = new User()
      user.email = email
      user.password = password

      when(usersRepositoryMock.create(deepEqual({ email, password }))).thenReturn(user)
      when(usersRepositoryMock.save(user)).thenResolve(user)

      const result = await usersService.create(email, password)

      expect(result).toEqual(user)

      verify(usersRepositoryMock.create(deepEqual({ email, password }))).once()
      verify(usersRepositoryMock.save(user)).once()
    })
  })

  describe('findOne', () => {
    it('should find a user by id', async () => {
      const id = 'some-id'
      const user = new User()
      user.id = id

      when(usersRepositoryMock.findOneBy(deepEqual({ id }))).thenResolve(user)

      const result = await usersService.findOne(id)

      expect(result).toEqual(user)

      verify(usersRepositoryMock.findOneBy(deepEqual({ id }))).once()
    })

    it('should return null if user is not found', async () => {
      const id = 'non-existent-id'

      when(usersRepositoryMock.findOneBy(deepEqual({ id }))).thenResolve(null)

      const result = await usersService.findOne(id)

      expect(result).toBeNull()
      verify(usersRepositoryMock.findOneBy(deepEqual({ id }))).once()
    })
  })

  describe('find', () => {
    it('should find users by email', async () => {
      const email = 'test@example.com'
      const users = [new User(), new User()]
      users[0].email = email
      users[1].email = email

      when(usersRepositoryMock.find(deepEqual({ where: { email } }))).thenResolve(users)

      const result = await usersService.find(email)

      expect(result).toEqual(users)

      verify(usersRepositoryMock.find(deepEqual({ where: { email } }))).once()
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

      when(usersRepositoryMock.findOneBy(deepEqual({ id }))).thenResolve(user)
      when(usersRepositoryMock.findOne(deepEqual({ where: { email: attrs.email } }))).thenResolve(
        null
      )
      when(usersRepositoryMock.save(anything())).thenResolve(user)

      const result = await usersService.update(id, attrs)

      expect(result).toEqual(user)
      expect(user.email).toEqual(attrs.email)
      verify(usersRepositoryMock.findOneBy(deepEqual({ id }))).once()
      verify(usersRepositoryMock.findOne(deepEqual({ where: { email: attrs.email } }))).once()
      verify(usersRepositoryMock.save(user)).once()
    })

    it('should throw NotFoundException if user not found', async () => {
      const id = 'non-existent-id'
      const attrs: Partial<User> = { email: 'newemail@example.com' }

      when(usersRepositoryMock.findOneBy(deepEqual({ id }))).thenResolve(null)

      await expect(usersService.update(id, attrs)).rejects.toThrow(NotFoundException)

      verify(usersRepositoryMock.findOneBy(deepEqual({ id }))).once()
      verify(usersRepositoryMock.findOne(anything())).never()
      verify(usersRepositoryMock.save(anything())).never()
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

      when(usersRepositoryMock.findOneBy(deepEqual({ id }))).thenResolve(user)
      when(usersRepositoryMock.findOne(deepEqual({ where: { email: attrs.email } }))).thenResolve(
        existingUser
      )

      await expect(usersService.update(id, attrs)).rejects.toThrow(BadRequestException)

      verify(usersRepositoryMock.findOneBy(deepEqual({ id }))).once()
      verify(usersRepositoryMock.findOne(deepEqual({ where: { email: attrs.email } }))).once()
      verify(usersRepositoryMock.save(anything())).never()
    })
  })

  describe('remove', () => {
    it('should remove a user', async () => {
      const id = 'some-id'
      const user = new User()
      user.id = id

      when(usersRepositoryMock.findOneBy(deepEqual({ id }))).thenResolve(user)
      when(usersRepositoryMock.remove(user)).thenResolve(user)

      const result = await usersService.remove(id)

      expect(result).toEqual(user)

      verify(usersRepositoryMock.findOneBy(deepEqual({ id }))).once()
      verify(usersRepositoryMock.remove(user)).once()
    })

    it('should throw NotFoundException if user not found', async () => {
      const id = 'non-existent-id'

      when(usersRepositoryMock.findOneBy(deepEqual({ id }))).thenResolve(null)

      await expect(usersService.remove(id)).rejects.toThrow(NotFoundException)

      verify(usersRepositoryMock.findOneBy(deepEqual({ id }))).once()
      verify(usersRepositoryMock.remove(anything())).never()
    })
  })
})
