import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthController } from '$/auth/auth.controller'
import { AuthService } from '$/auth/auth.service'
import { HashService } from '$/auth/hash.service'
import { JwtStrategy } from '$/auth/jwt.strategy'
import { User } from '$/users/user.entity'
import { UsersModule } from '$/users/users.module'
import { UsersService } from '$/users/users.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' }
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, HashService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
