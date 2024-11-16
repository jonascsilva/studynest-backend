import { applyDecorators, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from '$/auth/jwt-auth.guard'

export function Authenticated() {
  return applyDecorators(UseGuards(JwtAuthGuard))
}
