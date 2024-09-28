import { IsString } from 'class-validator'

export class CreateNoteDto {
  @IsString()
  title: string

  @IsString()
  subject: string

  @IsString()
  content: string

  @IsString()
  userId: string
}
