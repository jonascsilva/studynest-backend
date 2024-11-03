import { IsInt, IsString } from 'class-validator'

export class CreateFlashcardRevisionDto {
  @IsString()
  flashcardId: string

  @IsInt()
  result: number
}
