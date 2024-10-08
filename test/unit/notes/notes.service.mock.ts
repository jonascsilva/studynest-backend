import { Note } from '$/notes/note.entity'

const date = new Date()

const notesMock: Note[] = [
  {
    id: '7f3ad2bc25ac4ba19a44b9ef135adf42',
    title: 'Revolução Francesa',
    subject: 'História',
    content: '',
    userId: 'cm0n1obcr0000y4jqcdwowlwl',
    createdAt: date,
    updatedAt: date,
    user: null
  },
  {
    id: '98029866259947f36c5e799ebfea234e',
    title: 'Guerra Fria',
    subject: 'História',
    content: '',
    userId: 'cm0n1obcr0000y4jqcdwowlwl',
    createdAt: date,
    updatedAt: date,
    user: null
  },
  {
    id: '4f7964e314a926409c071b53062b19af',
    title: 'Vitaminas',
    subject: 'Biologia',
    content: '',
    userId: 'cm0n1obcr0000y4jqcdwowlwl',
    createdAt: date,
    updatedAt: date,
    user: null
  }
]

class NotesServiceMock {
  notes = notesMock

  async findOne(id: string) {
    return this.notes.find(note => note.id === id)
  }

  async find() {
    return this.notes
  }
}

export { notesMock, NotesServiceMock }
