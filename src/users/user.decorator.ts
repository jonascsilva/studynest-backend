import { createParamDecorator, ExecutionContext } from '@nestjs/common'

type RequestUser = {
  id: string
  email: string
  name: string
}

const getUserFromContext = (_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()

  return request.user
}

const ReqUser = createParamDecorator(getUserFromContext)

export { ReqUser, RequestUser, getUserFromContext }
