import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { instance, mock, when } from 'ts-mockito'

import { JwtStrategy } from '$/auth/jwt.strategy'

type Payload = {
  sub: string
  email: string
  name: string
}

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy
  let configServiceMock: ConfigService

  beforeEach(async () => {
    configServiceMock = mock(ConfigService)

    when(configServiceMock.get<string>('JWT_SECRET')).thenReturn('test-secret')

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: instance(configServiceMock)
        }
      ]
    }).compile()

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy)
  })

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined()
  })

  describe('validate', () => {
    it('should return the user object based on the payload', async () => {
      const payload: Payload = {
        sub: 'user-id',
        email: 'test@example.com',
        name: 'Test User'
      }

      const result = await jwtStrategy.validate(payload)

      expect(result).toEqual({
        id: payload.sub,
        email: payload.email,
        name: payload.name
      })
    })
  })
})
