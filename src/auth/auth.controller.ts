import { Controller, Post, Body } from '@nestjs/common'

import { AuthService } from '$/auth/auth.service'
import { CreateUserDto } from '$/auth/dtos/create-user.dto'

type AuthResult = {
  access_token: string
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() body: CreateUserDto): Promise<AuthResult> {
    const user = await this.authService.signup(body.email, body.password)

    return user
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto): Promise<AuthResult> {
    const user = this.authService.signin(body.email, body.password)

    return user
  }
}
