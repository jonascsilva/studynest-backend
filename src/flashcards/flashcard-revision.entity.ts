import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

import { Flashcard } from '$/flashcards/flashcard.entity'

@Entity()
export class FlashcardRevision {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('uuid')
  flashcardId: string

  @Column('int')
  result: number

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => Flashcard, flashcard => flashcard.flashcardRevisions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'flashcardId' })
  flashcard: Flashcard
}
