import { Test, TestingModule } from '@nestjs/testing'
import { Note as NoteModel } from '@prisma/client'

import { NotesService } from '$/notes/notes.service'

import { getNote as getNoteMock, notes as notesMock } from './mocks'

import { PrismaService } from '$/prisma.service'

describe('NotesService', () => {
  let notesService: NotesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotesService, PrismaService]
    }).compile()

    notesService = module.get<NotesService>(NotesService)
  })

  it('should be defined', () => {
    expect(notesService).toBeDefined()
  })

  describe('methods', () => {
    it('getAllNotes', async () => {
      expect(await notesService.getAllNotes()).toHaveLength(3)
    })

    it('getNote', async () => {
      jest.spyOn(notesService, 'getNote').mockImplementation(getNoteMock)

      expect(await notesService.getNote(notesMock[1].id)).toMatchObject<NoteModel>(notesMock[1])
    })
  })
})
