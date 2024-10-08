import { Test, TestingModule } from '@nestjs/testing'

import { Note } from '$/notes/note.entity'
import { NotesController } from '$/notes/notes.controller'
import { NotesService } from '$/notes/notes.service'

import { notesMock, NotesServiceMock } from './notes.service.mock'

describe('NotesController', () => {
  let notesController: NotesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        {
          provide: NotesService,
          useClass: NotesServiceMock
        }
      ]
    }).compile()

    notesController = module.get<NotesController>(NotesController)
  })

  it('should be defined', () => {
    expect(notesController).toBeDefined()
  })

  describe('routes', () => {
    it('/notes"', async () => {
      expect(await notesController.findAllNotes()).toHaveLength(3)
    })

    it('/notes/:id', async () => {
      expect(await notesController.findNote(notesMock[1].id)).toMatchObject<Note>(notesMock[1])
    })
  })
})
