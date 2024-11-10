import { Expose } from 'class-transformer'

export class FlashcardDto {
  @Expose()
  id: string

  @Expose()
  question: string

  @Expose()
  subject: string

  @Expose()
  answer: string

  @Expose()
  userId: string

  @Expose()
  currentLevel: number

  @Expose()
  nextReviewDate: Date

  @Expose()
  createdAt: Date

  @Expose()
  updatedAt: Date
}
