import { Expose } from 'class-transformer'

export class NoteDto {
  @Expose()
  id: string

  @Expose()
  title: string

  @Expose()
  subject: string

  @Expose()
  content: string

  @Expose()
  userId: string

  @Expose()
  createdAt: Date

  @Expose()
  updatedAt: Date
}
