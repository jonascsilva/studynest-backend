import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SettingsController } from '$/settings/settings.controller'
import { SettingsService } from '$/settings/settings.service'
import { UserSettings } from '$/settings/user-settings.entity'

@Module({
  imports: [TypeOrmModule.forFeature([UserSettings])],
  controllers: [SettingsController],
  providers: [SettingsService]
})
export class SettingsModule {}
