import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Query,
  ForbiddenException
} from '@nestjs/common'

import { Authenticated } from '$/auth/auth.decorator'
import { Serialize } from '$/interceptor/serialize.interceptor'
import { UpdateUserDto } from '$/users/dtos/update-user.dto'
import { UserDto } from '$/users/dtos/user.dto'
import { RequestUser, ReqUser } from '$/users/user.decorator'
import { UsersService } from '$/users/users.service'

@Controller('users')
@Serialize(UserDto)
@Authenticated()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@ReqUser() user: RequestUser) {
    return user
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(id)

    if (!user) {
      throw new NotFoundException('user not found')
    }

    return user
  }

  @Get()
  async findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email)
  }

  @Patch('/:id')
  async updateUser(
    @ReqUser() user: RequestUser,
    @Param('id') id: string,
    @Body() body: UpdateUserDto
  ) {
    if (user.id !== id) {
      throw new ForbiddenException('user can only update themselves')
    }

    return this.usersService.update(id, body)
  }

  @Delete('/:id')
  async removeUser(@ReqUser() user: RequestUser, @Param('id') id: string) {
    if (user.id !== id) {
      throw new ForbiddenException('user can only delete themselves')
    }

    return this.usersService.remove(id)
  }
}
