import { Expose } from 'class-transformer'

export class UserSettingsDto {
  @Expose()
  id: string

  @Expose()
  intervalsQuantity: number

  @Expose()
  baseInterval: number

  @Expose()
  intervalIncreaseRate: number
}
