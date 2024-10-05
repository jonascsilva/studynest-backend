import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
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

  @AfterInsert()
  logInsert() {
    console.log('Inserted user with id: ', this.id)
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated user with id: ', this.id)
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed user with id: ', this.id)
  }
}
