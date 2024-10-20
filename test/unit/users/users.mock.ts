import { v7 as uuid } from 'uuid'

import { User } from '$/users/user.entity'

const date = new Date()

const usersMock: User[] = [
  {
    id: uuid(),
    email: 'test@test.com',
    password: '123456',
    createdAt: date,
    updatedAt: date,
    notes: null,
    flashcards: null
  },
  {
    id: uuid(),
    email: 'test@test.com',
    password: '123456',
    createdAt: date,
    updatedAt: date,
    notes: null,
    flashcards: null
  },
  {
    id: uuid(),
    email: 'test@test.com',
    password: '123456',
    createdAt: date,
    updatedAt: date,
    notes: null,
    flashcards: null
  }
]

export { usersMock }
