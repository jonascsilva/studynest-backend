import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import { User } from '$/users/user.entity'

@Entity()
export class UserSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('uuid')
  userId: string

  @Column({ type: 'int', default: 5 })
  intervalsQuantity: number

  @Column({ type: 'int', default: 1 })
  baseInterval: number

  @Column({ type: 'float', default: 2 })
  intervalIncreaseRate: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToOne(() => User, user => user.userSettings)
  @JoinColumn({ name: 'userId' })
  user: User
}
