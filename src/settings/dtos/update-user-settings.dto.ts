import { IsOptional, IsInt, Min, Max } from 'class-validator'

export class UpdateUserSettingsDto {
  @Min(2)
  @Max(6)
  @IsInt()
  @IsOptional()
  intervalsQuantity?: number

  @Min(1)
  @Max(6)
  @IsInt()
  @IsOptional()
  baseInterval?: number

  @Min(1)
  @Max(4)
  @IsInt()
  @IsOptional()
  intervalIncreaseRate?: number
}
