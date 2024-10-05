import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import { Flashcard } from '$/flashcards/flashcard.entity'

@Entity()
export class FlashcardRevision {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('uuid')
  flashcardId: string

  @Column()
  remembered: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => Flashcard, flashcard => flashcard.flashcardRevisions)
  @JoinColumn({ name: 'flashcardId' })
  flashcard: Flashcard
}
