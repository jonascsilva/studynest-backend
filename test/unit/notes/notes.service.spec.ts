import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { Note } from '$/notes/note.entity'
import { NotesService } from '$/notes/notes.service'

import { NotesRepositoryMock } from './notes.repository.mock'

describe('NotesService', () => {
  let notesService: NotesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: getRepositoryToken(Note),
          useClass: NotesRepositoryMock
        }
      ]
    }).compile()

    notesService = module.get<NotesService>(NotesService)
  })

  it('should be defined', () => {
    expect(notesService).toBeDefined()
  })
})
