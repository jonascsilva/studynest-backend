import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { deepEqual, instance, mock, verify, when } from 'ts-mockito'
import { Repository } from 'typeorm'

import { SettingsService } from '$/settings/settings.service'
import { UserSettings } from '$/settings/user-settings.entity'

describe('SettingsService', () => {
  let settingsService: SettingsService
  let settingsRepoMock: Repository<UserSettings>
  const userId = 'fake-user-id'

  beforeEach(async () => {
    settingsRepoMock = mock(Repository<UserSettings>)

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        {
          provide: getRepositoryToken(UserSettings),
          useValue: instance(settingsRepoMock)
        }
      ]
    }).compile()

    settingsService = module.get<SettingsService>(SettingsService)
  })

  it('should be defined', () => {
    expect(settingsService).toBeDefined()
  })

  it('should find settings', async () => {
    const settingsMock = {
      id: 'fake-id',
      intervalsQuantity: 2,
      baseInterval: 2,
      intervalIncreaseRate: 2
    } as UserSettings

    when(settingsRepoMock.findOneBy(deepEqual({ userId }))).thenResolve(settingsMock)

    const result = await settingsService.findUserSettings(userId)

    expect(result).toEqual(settingsMock)

    verify(settingsRepoMock.findOneBy(deepEqual({ userId }))).once()
  })

  it('should update settings', async () => {
    const settingsMock = {
      intervalsQuantity: 2,
      baseInterval: 2,
      intervalIncreaseRate: 2
    } as UserSettings

    when(settingsRepoMock.findOneBy(deepEqual({ userId }))).thenResolve(settingsMock)
    when(settingsRepoMock.save(settingsMock)).thenResolve(settingsMock)

    const result = await settingsService.updateUserSettings(userId, settingsMock)

    expect(result).toEqual(settingsMock)

    verify(settingsRepoMock.findOneBy(deepEqual({ userId }))).once()
    verify(settingsRepoMock.save(settingsMock)).once()
  })
})
