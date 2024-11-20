import { IsOptional, IsInt } from 'class-validator'

export class UpdateUserSettingsDto {
  @IsInt()
  @IsOptional()
  intervalsQuantity?: number

  @IsInt()
  @IsOptional()
  baseInterval?: number

  @IsInt()
  @IsOptional()
  intervalIncreaseRate?: number
}
