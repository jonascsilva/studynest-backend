import { Controller, Post, Body } from '@nestjs/common'

import { AuthService } from '$/auth/auth.service'
import { CreateUserDto } from '$/auth/dtos/create-user.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() body: CreateUserDto) {
    const user = await this.authService.signup(body.email, body.password)

    return { message: 'User registered successfully', user }
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto) {
    return this.authService.signin(body.email, body.password)
  }
}
