import { Test, TestingModule } from '@nestjs/testing'
import { instance, mock, when } from 'ts-mockito'

import { AppController } from '$/app.controller'
import { AppService } from '$/app.service'

describe('AppController', () => {
  let appController: AppController
  let appServiceMock: AppService

  beforeEach(async () => {
    appServiceMock = mock(AppService)

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: instance(appServiceMock)
        }
      ]
    }).compile()

    appController = app.get<AppController>(AppController)
  })

  it('should be defined', () => {
    expect(appController).toBeDefined()
  })

  describe('root', () => {
    it('should return a string', () => {
      when(appServiceMock.getIndex()).thenReturn('Index route is working on version 1.0.0!')

      expect(appController.getIndex()).toBe('Index route is working on version 1.0.0!')
    })
  })
})
