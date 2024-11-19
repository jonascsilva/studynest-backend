import { Test, TestingModule } from '@nestjs/testing'
import { instance, mock, verify, when } from 'ts-mockito'

import { SettingsController } from '$/settings/settings.controller'
import { SettingsService } from '$/settings/settings.service'
import { UserSettings } from '$/settings/user-settings.entity'

describe('SettingsController', () => {
  let settingsController: SettingsController
  let settingsServiceMock: SettingsService
  const userId = 'fake-user-id'
  const requestUser = {
    email: 'fake-email',
    name: 'fake-name',
    id: userId
  }

  beforeEach(async () => {
    settingsServiceMock = mock(SettingsService)

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingsController],
      providers: [
        {
          provide: SettingsService,
          useValue: instance(settingsServiceMock)
        }
      ]
    }).compile()

    settingsController = module.get<SettingsController>(SettingsController)
  })

  it('should be defined', () => {
    expect(settingsController).toBeDefined()
  })

  it('should return the settings', async () => {
    const settingsMock = {
      id: 'fake-id',
      intervalsQuantity: 2,
      baseInterval: 2,
      intervalIncreaseRate: 2
    } as UserSettings

    when(settingsServiceMock.findUserSettings(userId)).thenResolve(settingsMock)

    const result = await settingsController.getSettings(requestUser)

    expect(result).toEqual(settingsMock)

    verify(settingsServiceMock.findUserSettings(userId)).once()
  })

  it('should update the settings', async () => {
    const settingsMock = {
      intervalsQuantity: 2,
      baseInterval: 2,
      intervalIncreaseRate: 2
    } as UserSettings

    when(settingsServiceMock.updateUserSettings(userId, settingsMock)).thenResolve(settingsMock)

    const result = await settingsController.updateUserSettings(requestUser, settingsMock)

    expect(result).toEqual(settingsMock)

    verify(settingsServiceMock.updateUserSettings(userId, settingsMock)).once()
  })
})
