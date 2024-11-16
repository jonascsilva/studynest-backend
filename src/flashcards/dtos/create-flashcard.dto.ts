import { IsString } from 'class-validator'

export class CreateFlashcardDto {
  @IsString()
  question: string

  @IsString()
  subject: string

  @IsString()
  answer: string
}
