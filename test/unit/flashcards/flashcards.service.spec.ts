import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { instance, mock, when, verify, anything, deepEqual } from 'ts-mockito'
import { Repository } from 'typeorm'

import { FlashcardRevision } from '$/flashcards/flashcard-revision.entity'
import { Flashcard } from '$/flashcards/flashcard.entity'
import { FlashcardsService } from '$/flashcards/flashcards.service'
import { calculateCurrentIntervalLevel, calculateNextReviewDate } from '$/flashcards/utils'
import { UserSettings } from '$/settings/user-settings.entity'

import { dueFlashcardsMock, flashcardsMock, upcomingFlashcardsMock } from './flashcards.mock'

describe('FlashcardsService', () => {
  let flashcardsService: FlashcardsService
  let flashcardRepoMock: Repository<Flashcard>
  let flashcardRevisionRepoMock: Repository<FlashcardRevision>
  let userSettingsRepoMock: Repository<UserSettings>
  const userId = 'fake-user-id'

  beforeEach(async () => {
    flashcardRepoMock = mock(Repository<Flashcard>)
    flashcardRevisionRepoMock = mock(Repository<FlashcardRevision>)
    userSettingsRepoMock = mock(Repository<UserSettings>)

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlashcardsService,
        {
          provide: getRepositoryToken(Flashcard),
          useValue: instance(flashcardRepoMock)
        },
        {
          provide: getRepositoryToken(FlashcardRevision),
          useValue: instance(flashcardRevisionRepoMock)
        },
        {
          provide: getRepositoryToken(UserSettings),
          useValue: instance(userSettingsRepoMock)
        }
      ]
    }).compile()

    flashcardsService = module.get<FlashcardsService>(FlashcardsService)
  })

  it('should be defined', () => {
    expect(flashcardsService).toBeDefined()
  })

  describe('create', () => {
    it('should create and save a new flashcard', async () => {
      const attrs: Partial<Flashcard> = {
        question: 'What is NestJS?',
        answer: 'A progressive Node.js framework'
      }

      const flashcard = new Flashcard()

      Object.assign(flashcard, attrs)

      when(flashcardRepoMock.create(attrs)).thenReturn(flashcard)
      when(flashcardRepoMock.save(flashcard)).thenResolve(flashcard)

      const result = await flashcardsService.create(userId, attrs)

      expect(result).toEqual(flashcard)

      verify(flashcardRepoMock.create(attrs)).once()
      verify(flashcardRepoMock.save(flashcard)).once()
    })
  })

  describe('findOne', () => {
    it('should find a flashcard by id', async () => {
      const id = 'some-id'

      when(flashcardRepoMock.findOneBy(deepEqual({ userId, id }))).thenResolve(flashcardsMock[0])

      const result = await flashcardsService.findOne(userId, id)

      expect(result).toEqual(flashcardsMock[0])
      verify(flashcardRepoMock.findOneBy(deepEqual({ userId, id }))).once()
    })

    it('should throw NotFoundException when flashcard does not exist', async () => {
      const id = 'non-existent-id'

      when(flashcardRepoMock.findOneBy(deepEqual({ userId, id }))).thenResolve(null)

      await expect(flashcardsService.findOne(userId, id)).rejects.toThrow(NotFoundException)

      verify(flashcardRepoMock.findOneBy(deepEqual({ userId, id }))).once()
    })
  })

  describe('find', () => {
    it('should find all flashcards', async () => {
      const userId = 'fake-user-id'

      when(flashcardRepoMock.findBy(deepEqual({ userId }))).thenResolve(flashcardsMock)

      const result = await flashcardsService.find(userId)

      expect(result).toEqual(flashcardsMock)

      verify(flashcardRepoMock.findBy(deepEqual({ userId }))).once()
    })
  })

  describe('update', () => {
    it('should update a flashcard', async () => {
      const id = 'some-id'
      const attrs: Partial<Flashcard> = {
        answer: 'An awesome Node.js framework'
      }

      const flashcard = { ...flashcardsMock[0], id }

      when(flashcardRepoMock.findOneBy(deepEqual({ userId, id }))).thenResolve(flashcard)
      when(flashcardRepoMock.save(anything())).thenResolve(flashcard)

      const result = await flashcardsService.update(userId, id, attrs)

      expect(result.question).toEqual(flashcard.question)
      expect(result.answer).toEqual(attrs.answer)

      verify(flashcardRepoMock.findOneBy(deepEqual({ userId, id }))).once()
      verify(flashcardRepoMock.save(flashcard)).once()
    })

    it('should throw NotFoundException if flashcard not found', async () => {
      const id = 'non-existent-id'
      const attrs: Partial<Flashcard> = {
        answer: 'An awesome Node.js framework'
      }

      when(flashcardRepoMock.findOneBy(deepEqual({ userId, id }))).thenResolve(null)

      await expect(flashcardsService.update(userId, id, attrs)).rejects.toThrow(NotFoundException)

      verify(flashcardRepoMock.findOneBy(deepEqual({ userId, id }))).once()
      verify(flashcardRepoMock.save(anything())).never()
    })
  })

  describe('remove', () => {
    it('should remove a flashcard', async () => {
      const id = 'fake-flashcard-id'

      const flashcard = { ...flashcardsMock[0], id }

      when(flashcardRepoMock.findOneBy(deepEqual({ userId, id }))).thenResolve(flashcard)
      when(flashcardRepoMock.remove(flashcard)).thenResolve(flashcard)

      const result = await flashcardsService.remove(userId, id)

      expect(result).toEqual(flashcard)

      verify(flashcardRepoMock.findOneBy(deepEqual({ userId, id }))).once()
      verify(flashcardRepoMock.remove(flashcard)).once()
    })

    it('should throw NotFoundException if flashcard not found', async () => {
      const id = 'non-existent-id'

      when(flashcardRepoMock.findOneBy(deepEqual({ userId, id }))).thenResolve(null)

      await expect(flashcardsService.remove(userId, id)).rejects.toThrow(NotFoundException)

      verify(flashcardRepoMock.findOneBy(deepEqual({ userId, id }))).once()
      verify(flashcardRepoMock.remove(anything())).never()
    })
  })

  describe('reviewFlashcard', () => {
    it('should save a new FlashcardRevision when the flashcard exists and belongs to the user', async () => {
      const userId = 'fake-user-id'
      const flashcardId = 'flashcard-id'
      const result = 1

      when(flashcardRepoMock.findOneBy(deepEqual({ userId, id: flashcardId }))).thenResolve(
        flashcardsMock[0]
      )

      when(flashcardRevisionRepoMock.save(anything())).thenResolve()

      const revisions: FlashcardRevision[] = [
        { result: 1, createdAt: new Date('2024-10-10T12:41:00.000Z') } as FlashcardRevision,
        { result: 1, createdAt: new Date('2024-10-10T12:41:00.000Z') } as FlashcardRevision,
        { result: 0, createdAt: new Date('2024-10-10T12:41:00.000Z') } as FlashcardRevision
      ]

      const userSettings = {
        userId,
        baseInterval: 1,
        intervalIncreaseRate: 2,
        intervalsQuantity: 5
      } as UserSettings

      when(flashcardRepoMock.findBy(deepEqual({ userId }))).thenResolve([flashcardsMock[0]])
      when(
        flashcardRevisionRepoMock.find(
          deepEqual({
            where: { flashcardId: flashcardsMock[0].id },
            order: { createdAt: 'ASC' }
          })
        )
      ).thenResolve(revisions)
      when(userSettingsRepoMock.findOneBy(deepEqual({ userId }))).thenResolve(userSettings)

      await flashcardsService.reviewFlashcard(userId, flashcardId, result)

      verify(flashcardRepoMock.findOneBy(deepEqual({ userId, id: flashcardId }))).once()
      verify(flashcardRevisionRepoMock.save(anything())).once()
    })

    it('should throw an error when the flashcard does not exist or does not belong to the user', async () => {
      const userId = 'user-id'
      const flashcardId = 'flashcard-id'
      const result = 1

      when(flashcardRepoMock.findOneBy(deepEqual({ userId, id: flashcardId }))).thenResolve(null)

      await expect(flashcardsService.reviewFlashcard(userId, flashcardId, result)).rejects.toThrow(
        Error
      )

      verify(flashcardRepoMock.findOneBy(deepEqual({ userId, id: flashcardId }))).once()
      verify(flashcardRevisionRepoMock.save(anything())).never()
    })
  })

  describe('getDueFlashcards', () => {
    beforeAll(() => {
      jest.useFakeTimers().setSystemTime(new Date('2024-10-11T14:21:00Z'))
    })

    afterAll(() => {
      jest.useRealTimers()
    })

    it('should return flashcards with no revisions as due', async () => {
      const userId = 'user-id'

      when(flashcardRepoMock.findBy(deepEqual({ userId }))).thenResolve(flashcardsMock)

      when(flashcardRevisionRepoMock.find(anything())).thenResolve([])

      const dueFlashcards = await flashcardsService.getFlashcardsWithReviews(userId)

      const flashcards = [...dueFlashcardsMock, ...upcomingFlashcardsMock]

      flashcards[0].currentLevel = 1
      flashcards[0].nextReviewDate = new Date('2024-10-10T14:21:00.000Z')
      flashcards[1].currentLevel = 1
      flashcards[1].nextReviewDate = new Date('2024-10-10T14:21:00.000Z')
      flashcards[2].currentLevel = 1
      flashcards[2].nextReviewDate = new Date('2024-10-10T14:21:00.000Z')

      expect(dueFlashcards).toEqual({
        dueFlashcards: [...dueFlashcardsMock, ...upcomingFlashcardsMock],
        upcomingFlashcards: []
      })

      verify(flashcardRepoMock.findBy(deepEqual({ userId }))).once()
      verify(flashcardRevisionRepoMock.find(anything())).times(flashcardsMock.length)
    })

    it('should return flashcards that are due based on nextReviewDate', async () => {
      const userId = 'user-id'

      const revisions: FlashcardRevision[] = [
        { result: 1, createdAt: new Date('2024-10-10T12:41:00.000Z') } as FlashcardRevision,
        { result: 1, createdAt: new Date('2024-10-10T12:41:00.000Z') } as FlashcardRevision,
        { result: 0, createdAt: new Date('2024-10-10T12:41:00.000Z') } as FlashcardRevision
      ]

      const userSettings = {
        userId,
        baseInterval: 1,
        intervalIncreaseRate: 2,
        intervalsQuantity: 5
      } as UserSettings

      when(flashcardRepoMock.findBy(deepEqual({ userId }))).thenResolve([flashcardsMock[0]])
      when(
        flashcardRevisionRepoMock.find(
          deepEqual({
            where: { flashcardId: flashcardsMock[0].id },
            order: { createdAt: 'ASC' }
          })
        )
      ).thenResolve(revisions)
      when(userSettingsRepoMock.findOneBy(deepEqual({ userId }))).thenResolve(userSettings)

      const currentLevel = calculateCurrentIntervalLevel(revisions, userSettings.intervalsQuantity)

      const lastRevisionDate = revisions[revisions.length - 1].createdAt

      const nextReviewDate = calculateNextReviewDate(
        userSettings.baseInterval,
        userSettings.intervalIncreaseRate,
        currentLevel,
        lastRevisionDate
      )

      jest.setSystemTime(new Date(nextReviewDate.getTime() + 1))

      const result = await flashcardsService.getFlashcardsWithReviews(userId)
      const { dueFlashcards, upcomingFlashcards } = result

      expect(dueFlashcards).toHaveLength(1)
      expect(upcomingFlashcards).toHaveLength(0)
      expect(dueFlashcards[0]).toEqual({
        ...flashcardsMock[0],
        currentLevel,
        nextReviewDate
      })

      verify(flashcardRepoMock.findBy(deepEqual({ userId }))).once()
      verify(flashcardRevisionRepoMock.find(anything())).once()
      verify(userSettingsRepoMock.findOneBy(deepEqual({ userId }))).once()
    })

    it('should not return flashcards that are not due', async () => {
      const userId = 'user-id'
      const flashcards = [{ id: 'flashcard-1', userId } as Flashcard]

      const revisions = [
        { result: 1, createdAt: new Date('2023-01-01') } as FlashcardRevision,
        { result: 1, createdAt: new Date('2023-01-02') } as FlashcardRevision
      ]

      const userSettings = {
        userId,
        baseInterval: 1,
        intervalIncreaseRate: 2,
        intervalsQuantity: 5
      } as UserSettings

      when(flashcardRepoMock.findBy(deepEqual({ userId }))).thenResolve(flashcards)
      when(
        flashcardRevisionRepoMock.find(
          deepEqual({
            where: { flashcardId: 'flashcard-1' },
            order: { createdAt: 'ASC' }
          })
        )
      ).thenResolve(revisions)
      when(userSettingsRepoMock.findOneBy(deepEqual({ userId }))).thenResolve(userSettings)

      const currentLevel = calculateCurrentIntervalLevel(revisions, userSettings.intervalsQuantity)

      const lastRevisionDate = revisions[revisions.length - 1].createdAt

      const nextReviewDate = calculateNextReviewDate(
        userSettings.baseInterval,
        userSettings.intervalIncreaseRate,
        currentLevel,
        lastRevisionDate
      )

      jest.setSystemTime(new Date(nextReviewDate.getTime() - 1))

      const result = await flashcardsService.getFlashcardsWithReviews(userId)
      const { dueFlashcards, upcomingFlashcards } = result

      expect(dueFlashcards).toHaveLength(0)
      expect(upcomingFlashcards).toHaveLength(1)

      verify(flashcardRepoMock.findBy(deepEqual({ userId }))).once()
      verify(flashcardRevisionRepoMock.find(anything())).once()
      verify(userSettingsRepoMock.findOneBy(deepEqual({ userId }))).once()
    })
  })
})
