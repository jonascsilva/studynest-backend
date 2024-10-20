import { v7 as uuid } from 'uuid'

import { Note } from '$/notes/note.entity'

const date = new Date()

const notesMock: Note[] = [
  {
    id: uuid(),
    title: 'Revolução Francesa',
    subject: 'História',
    content: '',
    userId: '8f82aa4e-57fb-4e07-9928-3616edcf45c0',
    createdAt: date,
    updatedAt: date,
    user: null
  },
  {
    id: uuid(),
    title: 'Guerra Fria',
    subject: 'História',
    content: '',
    userId: '8f82aa4e-57fb-4e07-9928-3616edcf45c0',
    createdAt: date,
    updatedAt: date,
    user: null
  },
  {
    id: uuid(),
    title: 'Vitaminas',
    subject: 'Biologia',
    content: '',
    userId: '8f82aa4e-57fb-4e07-9928-3616edcf45c0',
    createdAt: date,
    updatedAt: date,
    user: null
  }
]

export { notesMock }
