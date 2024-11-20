import { IsInt } from 'class-validator'

export class CreateFlashcardRevisionDto {
  @IsInt()
  result: number
}
