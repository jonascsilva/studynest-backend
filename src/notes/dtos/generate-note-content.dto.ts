import { IsString } from 'class-validator'

export class GenerateNoteContentDto {
  @IsString()
  subject: string

  @IsString()
  title: string
}
