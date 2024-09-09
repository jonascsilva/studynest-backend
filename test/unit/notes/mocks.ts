import { Note as NoteModel } from '@prisma/client'

const date = new Date()

const notes: NoteModel[] = [
  {
    id: '7f3ad2bc25ac4ba19a44b9ef135adf42',
    title: 'Revolução Francesa',
    subject: 'História',
    content: '',
    userId: 'cm0n1obcr0000y4jqcdwowlwl',
    createdAt: date,
    updatedAt: date
  },
  {
    id: '98029866259947f36c5e799ebfea234e',
    title: 'Guerra Fria',
    subject: 'História',
    content: '',
    userId: 'cm0n1obcr0000y4jqcdwowlwl',
    createdAt: date,
    updatedAt: date
  },
  {
    id: '4f7964e314a926409c071b53062b19af',
    title: 'Vitaminas',
    subject: 'Biologia',
    content: '',
    userId: 'cm0n1obcr0000y4jqcdwowlwl',
    createdAt: date,
    updatedAt: date
  }
]

const getNote = async (id: string) => notes.find(note => note.id === id)

export { notes, getNote }
