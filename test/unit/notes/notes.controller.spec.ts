import { Test, TestingModule } from '@nestjs/testing'
import { instance, mock, verify, when } from 'ts-mockito'

import { NotesController } from '$/notes/notes.controller'
import { NotesService } from '$/notes/notes.service'

import { notesMock } from './notes.mock'

describe('NotesController', () => {
  let notesController: NotesController
  let notesServiceMock: NotesService

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

  it('return all notes"', async () => {
    when(notesServiceMock.find()).thenResolve(notesMock)

    const result = await notesController.findAllNotes()

    expect(result).toEqual(notesMock)

    verify(notesServiceMock.find()).once()
  })

  it('should return a note', async () => {
    const { id } = notesMock[0]

    when(notesServiceMock.findOne(id)).thenResolve(notesMock[0])

    const result = await notesController.findNote(id)

    expect(result).toEqual(notesMock[0])

    verify(notesServiceMock.findOne(id)).once()
  })

  it('should create a note', async () => {
    when(notesServiceMock.create(notesMock[0])).thenResolve(notesMock[0])

    const result = await notesController.createNote(notesMock[0])

    expect(result).toEqual(notesMock[0])

    verify(notesServiceMock.create(notesMock[0])).once()
  })

  it('should update a note', async () => {
    const { id } = notesMock[0]

    when(notesServiceMock.update(id, notesMock[0])).thenResolve(notesMock[0])

    const result = await notesController.updateNote(id, notesMock[0])

    expect(result).toEqual(notesMock[0])

    verify(notesServiceMock.update(id, notesMock[0])).once()
  })

  it('should remove a note', async () => {
    const { id } = notesMock[0]

    when(notesServiceMock.remove(id)).thenResolve(notesMock[0])

    const result = await notesController.removeNote(id)

    expect(result).toEqual(notesMock[0])

    verify(notesServiceMock.remove(id)).once()
  })
})
