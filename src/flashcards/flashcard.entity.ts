import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import { User } from '$/users/user.entity'

@Entity()
export class Flashcard {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  question: string

  @Column()
  subject: string

  @Column()
  answer: string

  @Column()
  userId: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => User, user => user.notes)
  @JoinColumn({ name: 'userId' })
  user: User
}
