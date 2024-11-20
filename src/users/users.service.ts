import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { User } from '$/users/user.entity'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.userRepo.create({
      email,
      password,
      userSettings: {}
    })

    return this.userRepo.save(user)
  }

  findOne(id: string) {
    return this.userRepo.findOneBy({ id })
  }

  find(email: string) {
    return this.userRepo.findBy({ email })
  }

  async update(id: string, attrs: Partial<User>) {
    const user = await this.findOne(id)

    if (!user) {
      throw new NotFoundException('User not found')
    }

    if (attrs.email && attrs.email !== user.email) {
      const existingUser = await this.userRepo.findOneBy({ email: attrs.email })

      if (existingUser) {
        throw new BadRequestException('Email is already in use')
      }
    }

    Object.assign(user, attrs)

    return await this.userRepo.save(user)
  }

  async remove(id: string) {
    const user = await this.findOne(id)

    if (!user) {
      throw new NotFoundException('user not found')
    }

    return this.userRepo.remove(user)
  }
}
