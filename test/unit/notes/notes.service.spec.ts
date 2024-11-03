import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { mock, instance, when, verify, deepEqual } from 'ts-mockito'
import { Repository } from 'typeorm'

import { Note } from '$/notes/note.entity'
import { NotesService } from '$/notes/notes.service'

import { notesMock } from './notes.mock'

describe('NotesService', () => {
  let notesService: NotesService
  let noteRepoMock: Repository<Note>

  beforeEach(async () => {
    noteRepoMock = mock(Repository<Note>)

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: getRepositoryToken(Note),
          useValue: instance(noteRepoMock)
        }
      ]
    }).compile()

    notesService = module.get<NotesService>(NotesService)
  })

  it('should be defined', () => {
    expect(notesService).toBeDefined()
  })

  it('should find notes', async () => {
    when(noteRepoMock.find()).thenResolve(notesMock)

    const result = await notesService.find()

    expect(result).toEqual(notesMock)

    verify(noteRepoMock.find()).once()
  })

  it('should find a note', async () => {
    const { id } = notesMock[0]

    when(noteRepoMock.findOneBy(deepEqual({ id }))).thenResolve(notesMock[0])

    const result = await notesService.findOne(id)

    expect(result).toEqual(notesMock[0])

    verify(noteRepoMock.findOneBy(deepEqual({ id }))).once()
  })

  it('should handle a failed find', async () => {
    const { id } = notesMock[0]

    when(noteRepoMock.findOneBy(deepEqual({ id }))).thenResolve(null)

    const result = notesService.findOne(id)

    expect(result).rejects.toThrow(NotFoundException)

    verify(noteRepoMock.findOneBy(deepEqual({ id }))).once()
  })

  it('should create a new note', async () => {
    when(noteRepoMock.create(notesMock[0])).thenReturn(notesMock[0])
    when(noteRepoMock.save(notesMock[0])).thenResolve(notesMock[0])

    const result = await notesService.create(notesMock[0])

    expect(result).toEqual(notesMock[0])

    verify(noteRepoMock.create(notesMock[0])).once()
    verify(noteRepoMock.save(notesMock[0])).once()
  })

  it('should update a note', async () => {
    const { id } = notesMock[0]

    when(noteRepoMock.findOneBy(deepEqual({ id }))).thenResolve(notesMock[0])
    when(noteRepoMock.save(notesMock[0])).thenResolve(notesMock[0])

    const result = await notesService.update(id, notesMock[0])

    expect(result).toEqual(notesMock[0])

    verify(noteRepoMock.findOneBy(deepEqual({ id }))).once()
    verify(noteRepoMock.save(notesMock[0])).once()
  })

  it('should remove a note', async () => {
    const { id } = notesMock[0]

    when(noteRepoMock.findOneBy(deepEqual({ id }))).thenResolve(notesMock[0])
    when(noteRepoMock.remove(notesMock[0])).thenResolve(notesMock[0])

    const result = await notesService.remove(id)

    expect(result).toEqual(notesMock[0])

    verify(noteRepoMock.findOneBy(deepEqual({ id }))).once()
    verify(noteRepoMock.remove(notesMock[0])).once()
  })
})
