import { Test, TestingModule } from '@nestjs/testing'
import { Note as NoteModel } from '@prisma/client'

import { NotesController } from '$/notes/notes.controller'
import { NotesService } from '$/notes/notes.service'

import { getNote as getNoteMock, notes as notesMock } from './mocks'

import { PrismaService } from '$/prisma.service'

describe('NotesController', () => {
  let notesController: NotesController
  let notesService: NotesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [NotesService, PrismaService]
    }).compile()

    notesService = module.get<NotesService>(NotesService)
    notesController = module.get<NotesController>(NotesController)
  })

  it('should be defined', () => {
    expect(notesController).toBeDefined()
  })

  describe('routes', () => {
    it('/notes"', async () => {
      jest.spyOn(notesService, 'getAllNotes').mockImplementation(async () => notesMock)

      expect(await notesController.getAllNotes()).toHaveLength(1)
    })

    it('/notes/:id', async () => {
      jest.spyOn(notesService, 'getNote').mockImplementation(getNoteMock)

      expect(await notesController.getNote(notesMock[1].id)).toMatchObject<NoteModel>(notesMock[1])
    })
  })
})
