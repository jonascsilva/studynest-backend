import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import { Flashcard } from '$/flashcards/flashcard.entity'
import { Note } from '$/notes/note.entity'
import { UserSettings } from '$/users/user-settings.entity'

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
  flashcards: Flashcard[]

  @OneToOne(() => UserSettings, userSettings => userSettings.user, { cascade: true })
  userSettings: UserSettings
}
