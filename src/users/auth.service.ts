import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'

import { randomBytes, scrypt as _scrypt } from 'crypto'
import { promisify } from 'util'

import { UsersService } from '$/users/users.service'

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.usersService.find(email)
    if (users.length) {
      throw new BadRequestException('Email is already in use')
    }

    const salt = randomBytes(8).toString('hex')

    const hash = (await scrypt(password, salt, 32)) as Buffer

    const result = salt + '.' + hash.toString('hex')

    const user = await this.usersService.create(email, result)

    return user
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email)
    if (!user) {
      throw new NotFoundException('User was not found')
    }

    const [salt, storedHash] = user.password.split('.')

    const hash = (await scrypt(password, salt, 32)) as Buffer

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Wrong password')
    }

    return user
  }
}
