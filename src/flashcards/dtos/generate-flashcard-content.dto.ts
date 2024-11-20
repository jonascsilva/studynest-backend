import { IsString } from 'class-validator'

export class GenerateFlashcardContentDto {
  @IsString()
  subject: string

  @IsString()
  question: string
}
