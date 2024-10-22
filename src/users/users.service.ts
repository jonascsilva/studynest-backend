import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { User } from '$/users/user.entity'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password })

    return this.repo.save(user)
  }

  findOne(id: string) {
    return this.repo.findOneBy({ id })
  }

  find(email: string) {
    return this.repo.find({ where: { email } })
  }

  async update(id: string, attrs: Partial<User>) {
    const user = await this.findOne(id)

    if (!user) {
      throw new NotFoundException('User not found')
    }

    if (attrs.email && attrs.email !== user.email) {
      const existingUser = await this.repo.findOne({ where: { email: attrs.email } })

      if (existingUser) {
        throw new BadRequestException('Email is already in use')
      }
    }

    Object.assign(user, attrs)

    return await this.repo.save(user)
  }

  async remove(id: string) {
    const user = await this.findOne(id)

    if (!user) {
      throw new NotFoundException('user not found')
    }

    return this.repo.remove(user)
  }
}
