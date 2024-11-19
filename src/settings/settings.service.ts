import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UserSettings } from '$/settings/user-settings.entity'

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(UserSettings)
    private readonly userSettingsRepo: Repository<UserSettings>
  ) {}

  findUserSettings(userId: string) {
    return this.userSettingsRepo.findOneBy({ userId })
  }

  async updateUserSettings(userId: string, attrs: Partial<UserSettings>) {
    const userSettings = await this.userSettingsRepo.findOneBy({ userId })

    Object.assign(userSettings, attrs)

    return await this.userSettingsRepo.save(userSettings)
  }
}
