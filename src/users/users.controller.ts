import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Query,
  UseGuards,
  Request
} from '@nestjs/common'

import { JwtAuthGuard } from '$/auth/jwt-auth.guard'
import { Serialize } from '$/interceptor/serialize.interceptor'
import { UpdateUserDto } from '$/users/dtos/update-user.dto'
import { UserDto } from '$/users/dtos/user.dto'
import { UsersService } from '$/users/users.service'

type User = {
  id: string
  email: string
  name: string
}

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: { user: User }) {
    return req.user
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
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email)
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(id)
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body)
  }
}
