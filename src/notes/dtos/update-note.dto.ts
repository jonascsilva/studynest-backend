import { IsString, IsOptional, IsBoolean } from 'class-validator'

export class UpdateNoteDto {
  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  subject?: string

  @IsString()
  @IsOptional()
  content?: string

  @IsBoolean()
  @IsOptional()
  shared?: boolean
}
