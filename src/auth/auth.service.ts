import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { HashService } from '$/auth/hash.service'
import { UsersService } from '$/users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService
  ) {}

  async signup(email: string, password: string) {
    const users = await this.usersService.find(email)

    if (users.length) {
      throw new BadRequestException('Email is already in use')
    }

    const hash = await this.hashService.hash(password)

    const user = await this.usersService.create(email, hash)

    const payload = { sub: user.id, email: user.email, name: user.name }

    const access_token = this.jwtService.sign(payload)

    return {
      access_token
    }
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email)

    if (!user) {
      throw new NotFoundException('User was not found')
    }

    const passwordMatches = await this.hashService.verify(user.password, password)

    if (!passwordMatches) {
      throw new BadRequestException('Wrong password')
    }

    const payload = { sub: user.id, email: user.email, name: user.name }

    const access_token = this.jwtService.sign(payload)

    return {
      access_token
    }
  }
}
