import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import { Flashcard } from '$/flashcards/flashcard.entity'
import { Note } from '$/notes/note.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: true })
  name?: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => Note, note => note.user)
  notes: Note[]

  @OneToMany(() => Flashcard, flashcard => flashcard.user)
  flashcards: Note[]
}
