import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import { FlashcardRevision } from '$/flashcards/flashcard-revision.entity'
import { User } from '$/users/user.entity'

@Entity()
export class Flashcard {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('text', { default: '' })
  question: string

  @Column('text', { default: '' })
  subject: string

  @Column('text', { default: '' })
  answer: string

  @Column({ default: false })
  shared: boolean

  @Column('uuid')
  userId: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => User, user => user.flashcards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User

  @OneToMany(() => FlashcardRevision, flashcardRevision => flashcardRevision.flashcard, {
    cascade: true
  })
  flashcardRevisions: FlashcardRevision[]
}
