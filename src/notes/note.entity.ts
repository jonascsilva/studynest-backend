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
export class Note {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('text', { default: '' })
  title: string

  @Column('text', { default: '' })
  subject: string

  @Column('text', { default: '' })
  content: string

  @Column('uuid')
  userId: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => User, user => user.notes)
  @JoinColumn({ name: 'userId' })
  user: User
}
