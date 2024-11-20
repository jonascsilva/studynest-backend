import { Body, Controller, Get, Patch } from '@nestjs/common'

import { Authenticated } from '$/auth/auth.decorator'
import { Serialize } from '$/interceptor/serialize.interceptor'
import { UpdateUserSettingsDto } from '$/settings/dtos/update-user-settings.dto'
import { UserSettingsDto } from '$/settings/dtos/user-settings.dto'
import { SettingsService } from '$/settings/settings.service'
import { RequestUser, ReqUser } from '$/users/user.decorator'

@Controller('settings')
@Serialize(UserSettingsDto)
@Authenticated()
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getSettings(@ReqUser() user: RequestUser) {
    return this.settingsService.findUserSettings(user.id)
  }

  @Patch()
  async updateUserSettings(@ReqUser() user: RequestUser, @Body() body: UpdateUserSettingsDto) {
    return this.settingsService.updateUserSettings(user.id, body)
  }
}
