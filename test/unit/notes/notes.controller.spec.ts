import { Test, TestingModule } from '@nestjs/testing'
import { instance, mock, verify, when } from 'ts-mockito'

import { NotesController } from '$/notes/notes.controller'
import { NotesService } from '$/notes/notes.service'

import { notesMock } from './notes.mock'

describe('NotesController', () => {
  let notesController: NotesController
  let notesServiceMock: NotesService
  const userId = 'fake-user-id'
  const requestUser = {
    email: 'fake-email',
    name: 'fake-name',
    id: userId
  }

  beforeEach(async () => {
    notesServiceMock = mock(NotesService)

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        {
          provide: NotesService,
          useValue: instance(notesServiceMock)
        }
      ]
    }).compile()

    notesController = module.get<NotesController>(NotesController)
  })

  it('should be defined', () => {
    expect(notesController).toBeDefined()
  })

  it('should return all notes"', async () => {
    when(notesServiceMock.find(userId)).thenResolve(notesMock)

    const result = await notesController.findAllNotes(requestUser)

    expect(result).toEqual(notesMock)

    verify(notesServiceMock.find(userId)).once()
  })

  it('should return a note', async () => {
    const { id } = notesMock[0]

    when(notesServiceMock.findOne(userId, id)).thenResolve(notesMock[0])

    const result = await notesController.findNote(requestUser, id)

    expect(result).toEqual(notesMock[0])

    verify(notesServiceMock.findOne(userId, id)).once()
  })

  it('should create a note', async () => {
    when(notesServiceMock.create(userId, notesMock[0])).thenResolve(notesMock[0])

    const result = await notesController.createNote(requestUser, notesMock[0])

    expect(result).toEqual(notesMock[0])

    verify(notesServiceMock.create(userId, notesMock[0])).once()
  })

  it('should update a note', async () => {
    const { id } = notesMock[0]

    when(notesServiceMock.update(userId, id, notesMock[0])).thenResolve(notesMock[0])

    const result = await notesController.updateNote(requestUser, id, notesMock[0])

    expect(result).toEqual(notesMock[0])

    verify(notesServiceMock.update(userId, id, notesMock[0])).once()
  })

  it('should remove a note', async () => {
    const { id } = notesMock[0]

    when(notesServiceMock.remove(userId, id)).thenResolve(notesMock[0])

    const result = await notesController.removeNote(requestUser, id)

    expect(result).toEqual(notesMock[0])

    verify(notesServiceMock.remove(userId, id)).once()
  })
})
