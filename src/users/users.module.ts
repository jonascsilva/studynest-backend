import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthService } from '$/users/auth.service'
import { User } from '$/users/user.entity'
import { UsersController } from '$/users/users.controller'
import { UsersService } from '$/users/users.service'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, AuthService]
})
export class UsersModule {}
