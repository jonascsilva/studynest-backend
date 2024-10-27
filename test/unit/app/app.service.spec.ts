import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { instance, mock, when } from 'ts-mockito'

import { AppService } from '$/app.service'

describe('AuthService', () => {
  let appService: AppService
  let configServiceMock: ConfigService

  beforeEach(async () => {
    configServiceMock = mock(ConfigService)

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: ConfigService,
          useValue: instance(configServiceMock)
        }
      ]
    }).compile()

    appService = module.get<AppService>(AppService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(appService).toBeDefined()
  })

  it('should return the index message with the package version', async () => {
    when(configServiceMock.get('npm_package_version')).thenReturn('1.0.0')

    const result = appService.getIndex()

    expect(result).toEqual('Index route is working on version 1.0.0!')
  })
})
