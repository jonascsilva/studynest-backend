import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { mock, instance, when, verify, deepEqual } from 'ts-mockito'
import { Repository, SelectQueryBuilder } from 'typeorm'

import { Note } from '$/notes/note.entity'
import { NotesService } from '$/notes/notes.service'

import { notesMock } from './notes.mock'

describe('NotesService', () => {
  let notesService: NotesService
  let noteRepoMock: Repository<Note>
  const userId = 'fake-user-id'

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
    const queryOptions = {
      where: { userId },
      order: { createdAt: 'DESC' as const }
    }

    when(noteRepoMock.find(deepEqual(queryOptions))).thenResolve(notesMock)

    const result = await notesService.find(userId)

    expect(result).toEqual(notesMock)

    verify(noteRepoMock.find(deepEqual(queryOptions))).once()
  })

  describe('findShared', () => {
    it("should return shared notes excluding the user's own notes when no query is provided", async () => {
      const userId = 'user-id'
      const sharedNotes = [
        {
          id: 'note-1',
          title: 'Shared Note 1',
          subject: 'Subject 1',
          shared: true,
          userId: 'other-user-id'
        } as Note,
        {
          id: 'note-2',
          title: 'Shared Note 2',
          subject: 'Subject 2',
          shared: true,
          userId: 'another-user-id'
        } as Note
      ]

      const qbMock = mock<SelectQueryBuilder<Note>>()

      when(noteRepoMock.createQueryBuilder('note')).thenReturn(instance(qbMock))
      when(qbMock.where('note.shared = :shared', deepEqual({ shared: true }))).thenReturn(
        instance(qbMock)
      )
      when(qbMock.andWhere('note.userId != :userId', deepEqual({ userId }))).thenReturn(
        instance(qbMock)
      )
      when(qbMock.orderBy('note.createdAt', 'DESC')).thenReturn(instance(qbMock))
      when(qbMock.getMany()).thenResolve(sharedNotes)

      const result = await notesService.findShared(userId)

      expect(result).toEqual(sharedNotes)

      verify(noteRepoMock.createQueryBuilder('note')).once()
      verify(qbMock.where('note.shared = :shared', deepEqual({ shared: true }))).once()
      verify(qbMock.andWhere('note.userId != :userId', deepEqual({ userId }))).once()
      verify(qbMock.orderBy('note.createdAt', 'DESC')).once()
      verify(qbMock.getMany()).once()
    })

    it('should return shared notes matching the query when query is provided', async () => {
      const userId = 'user-id'
      const query = 'test'
      const lowerQuery = `%${query.toLowerCase()}%`
      const sharedNotes = [
        {
          id: 'note-1',
          title: 'Test Note',
          subject: 'Subject 1',
          shared: true,
          userId: 'other-user-id'
        } as Note
      ]

      const qbMock = mock<SelectQueryBuilder<Note>>()

      when(noteRepoMock.createQueryBuilder('note')).thenReturn(instance(qbMock))
      when(qbMock.where('note.shared = :shared', deepEqual({ shared: true }))).thenReturn(
        instance(qbMock)
      )
      when(qbMock.andWhere('note.userId != :userId', deepEqual({ userId }))).thenReturn(
        instance(qbMock)
      )
      when(qbMock.orderBy('note.createdAt', 'DESC')).thenReturn(instance(qbMock))
      when(
        qbMock.andWhere(
          '(LOWER(note.title) LIKE :query OR LOWER(note.subject) LIKE :query)',
          deepEqual({ query: lowerQuery })
        )
      ).thenReturn(instance(qbMock))
      when(qbMock.getMany()).thenResolve(sharedNotes)

      const result = await notesService.findShared(userId, query)

      expect(result).toEqual(sharedNotes)

      verify(noteRepoMock.createQueryBuilder('note')).once()
      verify(qbMock.where('note.shared = :shared', deepEqual({ shared: true }))).once()
      verify(qbMock.andWhere('note.userId != :userId', deepEqual({ userId }))).once()
      verify(qbMock.orderBy('note.createdAt', 'DESC')).once()
      verify(
        qbMock.andWhere(
          '(LOWER(note.title) LIKE :query OR LOWER(note.subject) LIKE :query)',
          deepEqual({ query: lowerQuery })
        )
      ).once()
      verify(qbMock.getMany()).once()
    })

    it('should return an empty array when no shared notes are found', async () => {
      const userId = 'user-id'
      const query = 'non-existent-query'

      const qbMock = mock<SelectQueryBuilder<Note>>()

      when(noteRepoMock.createQueryBuilder('note')).thenReturn(instance(qbMock))
      when(qbMock.where('note.shared = :shared', deepEqual({ shared: true }))).thenReturn(
        instance(qbMock)
      )
      when(qbMock.andWhere('note.userId != :userId', deepEqual({ userId }))).thenReturn(
        instance(qbMock)
      )
      when(qbMock.orderBy('note.createdAt', 'DESC')).thenReturn(instance(qbMock))
      when(
        qbMock.andWhere(
          '(LOWER(note.title) LIKE :query OR LOWER(note.subject) LIKE :query)',
          deepEqual({ query: `%${query.toLowerCase()}%` })
        )
      ).thenReturn(instance(qbMock))
      when(qbMock.getMany()).thenResolve([])

      const result = await notesService.findShared(userId, query)

      expect(result).toEqual([])

      verify(noteRepoMock.createQueryBuilder('note')).once()
      verify(qbMock.where('note.shared = :shared', deepEqual({ shared: true }))).once()
      verify(qbMock.andWhere('note.userId != :userId', deepEqual({ userId }))).once()
      verify(qbMock.orderBy('note.createdAt', 'DESC')).once()
      verify(
        qbMock.andWhere(
          '(LOWER(note.title) LIKE :query OR LOWER(note.subject) LIKE :query)',
          deepEqual({ query: `%${query.toLowerCase()}%` })
        )
      ).once()
      verify(qbMock.getMany()).once()
    })
  })

  it('should find a note', async () => {
    const { id } = notesMock[0]

    when(noteRepoMock.findOneBy(deepEqual({ userId, id }))).thenResolve(notesMock[0])

    const result = await notesService.findOne(userId, id)

    expect(result).toEqual(notesMock[0])

    verify(noteRepoMock.findOneBy(deepEqual({ userId, id }))).once()
  })

  it('should handle a failed find', async () => {
    const { id } = notesMock[0]

    when(noteRepoMock.findOneBy(deepEqual({ userId, id }))).thenResolve(null)

    const result = notesService.findOne(userId, id)

    expect(result).rejects.toThrow(NotFoundException)

    verify(noteRepoMock.findOneBy(deepEqual({ userId, id }))).once()
  })

  it('should create a new note', async () => {
    when(noteRepoMock.create(notesMock[0])).thenReturn(notesMock[0])
    when(noteRepoMock.save(notesMock[0])).thenResolve(notesMock[0])

    const result = await notesService.create(userId, notesMock[0])

    expect(result).toEqual(notesMock[0])

    verify(noteRepoMock.create(notesMock[0])).once()
    verify(noteRepoMock.save(notesMock[0])).once()
  })

  it('should update a note', async () => {
    const { id } = notesMock[0]

    when(noteRepoMock.findOneBy(deepEqual({ userId, id }))).thenResolve(notesMock[0])
    when(noteRepoMock.save(notesMock[0])).thenResolve(notesMock[0])

    const result = await notesService.update(userId, id, notesMock[0])

    expect(result).toEqual(notesMock[0])

    verify(noteRepoMock.findOneBy(deepEqual({ userId, id }))).once()
    verify(noteRepoMock.save(notesMock[0])).once()
  })

  it('should remove a note', async () => {
    const { id } = notesMock[0]

    when(noteRepoMock.findOneBy(deepEqual({ userId, id }))).thenResolve(notesMock[0])
    when(noteRepoMock.remove(notesMock[0])).thenResolve(notesMock[0])

    const result = await notesService.remove(userId, id)

    expect(result).toEqual(notesMock[0])

    verify(noteRepoMock.findOneBy(deepEqual({ userId, id }))).once()
    verify(noteRepoMock.remove(notesMock[0])).once()
  })
})
