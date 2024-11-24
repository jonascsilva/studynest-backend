import { IsString, IsOptional, IsBoolean } from 'class-validator'

export class UpdateFlashcardDto {
  @IsString()
  @IsOptional()
  question?: string

  @IsString()
  @IsOptional()
  subject?: string

  @IsString()
  @IsOptional()
  answer?: string

  @IsBoolean()
  @IsOptional()
  shared?: boolean
}
