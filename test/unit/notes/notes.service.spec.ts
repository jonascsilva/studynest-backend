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
  let notesRepositoryMock: Repository<Note>

  beforeEach(async () => {
    notesRepositoryMock = mock(Repository<Note>)

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: getRepositoryToken(Note),
          useValue: instance(notesRepositoryMock)
        }
      ]
    }).compile()

    notesService = module.get<NotesService>(NotesService)
  })

  it('should be defined', () => {
    expect(notesService).toBeDefined()
  })

  it('should find notes', async () => {
    when(notesRepositoryMock.find()).thenResolve(notesMock)

    const result = await notesService.find()

    expect(result).toEqual(notesMock)

    verify(notesRepositoryMock.find()).once()
  })

  it('should find a note', async () => {
    const { id } = notesMock[0]

    when(notesRepositoryMock.findOneBy(deepEqual({ id }))).thenResolve(notesMock[0])

    const result = await notesService.findOne(id)

    expect(result).toEqual(notesMock[0])

    verify(notesRepositoryMock.findOneBy(deepEqual({ id }))).once()
  })

  it('should handle a failed find', async () => {
    const { id } = notesMock[0]

    when(notesRepositoryMock.findOneBy(deepEqual({ id }))).thenResolve(null)

    const result = notesService.findOne(id)

    expect(result).rejects.toThrow(NotFoundException)

    verify(notesRepositoryMock.findOneBy(deepEqual({ id }))).once()
  })

  it('should create a new note', async () => {
    when(notesRepositoryMock.create(notesMock[0])).thenReturn(notesMock[0])
    when(notesRepositoryMock.save(notesMock[0])).thenResolve(notesMock[0])

    const result = await notesService.create(notesMock[0])

    expect(result).toEqual(notesMock[0])

    verify(notesRepositoryMock.create(notesMock[0])).once()
    verify(notesRepositoryMock.save(notesMock[0])).once()
  })

  it('should update a note', async () => {
    const { id } = notesMock[0]

    when(notesRepositoryMock.findOneBy(deepEqual({ id }))).thenResolve(notesMock[0])
    when(notesRepositoryMock.save(notesMock[0])).thenResolve(notesMock[0])

    const result = await notesService.update(id, notesMock[0])

    expect(result).toEqual(notesMock[0])

    verify(notesRepositoryMock.findOneBy(deepEqual({ id }))).once()
    verify(notesRepositoryMock.save(notesMock[0])).once()
  })

  it('should remove a note', async () => {
    const { id } = notesMock[0]

    when(notesRepositoryMock.findOneBy(deepEqual({ id }))).thenResolve(notesMock[0])
    when(notesRepositoryMock.remove(notesMock[0])).thenResolve(notesMock[0])

    const result = await notesService.remove(id)

    expect(result).toEqual(notesMock[0])

    verify(notesRepositoryMock.findOneBy(deepEqual({ id }))).once()
    verify(notesRepositoryMock.remove(notesMock[0])).once()
  })
})
