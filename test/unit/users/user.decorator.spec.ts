import { ExecutionContext } from '@nestjs/common'

import { getUserFromContext } from '$/users/user.decorator'

describe('User Decorator', () => {
  it('should return the user from the request object', () => {
    const mockRequest = {
      user: {
        id: 'user-id',
        email: 'user@example.com',
        name: 'User Name'
      }
    }

    const contextMock: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest
      })
    } as any

    const result = getUserFromContext(null, contextMock)

    expect(result).toEqual(mockRequest.user)
  })
})
