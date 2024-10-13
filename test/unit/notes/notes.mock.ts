import { v7 as uuid } from 'uuid'

import { Note } from '$/notes/note.entity'

const date = new Date()

const notesMock: Note[] = [
  {
    id: uuid(),
    title: 'Revolução Francesa',
    subject: 'História',
    content: '',
    userId: 'cm0n1obcr0000y4jqcdwowlwl',
    createdAt: date,
    updatedAt: date,
    user: null
  },
  {
    id: uuid(),
    title: 'Guerra Fria',
    subject: 'História',
    content: '',
    userId: 'cm0n1obcr0000y4jqcdwowlwl',
    createdAt: date,
    updatedAt: date,
    user: null
  },
  {
    id: uuid(),
    title: 'Vitaminas',
    subject: 'Biologia',
    content: '',
    userId: 'cm0n1obcr0000y4jqcdwowlwl',
    createdAt: date,
    updatedAt: date,
    user: null
  }
]

export { notesMock }
