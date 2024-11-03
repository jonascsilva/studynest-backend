import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { instance, mock, when, verify, anything, deepEqual } from 'ts-mockito'
import { Repository } from 'typeorm'

import { FlashcardRevision } from '$/flashcards/flashcard-revision.entity'
import { Flashcard } from '$/flashcards/flashcard.entity'
import { FlashcardsService } from '$/flashcards/flashcards.service'
import { calculateCurrentIntervalLevel, calculateNextReviewDate } from '$/flashcards/utils'
import { UserSettings } from '$/users/user-settings.entity'

describe('FlashcardsService', () => {
  let flashcardsService: FlashcardsService
  let flashcardRepoMock: Repository<Flashcard>
  let flashcardRevisionRepoMock: Repository<FlashcardRevision>
  let userSettingsRepoMock: Repository<UserSettings>

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

      const result = await flashcardsService.create(attrs)

      expect(result).toEqual(flashcard)

      verify(flashcardRepoMock.create(attrs)).once()
      verify(flashcardRepoMock.save(flashcard)).once()
    })
  })

  describe('findOne', () => {
    it('should find a flashcard by id', async () => {
      const id = 'some-id'
      const flashcard = new Flashcard()
      flashcard.id = id

      when(flashcardRepoMock.findOneBy(deepEqual({ id }))).thenResolve(flashcard)

      const result = await flashcardsService.findOne(id)

      expect(result).toEqual(flashcard)
      verify(flashcardRepoMock.findOneBy(deepEqual({ id }))).once()
    })

    it('should throw NotFoundException when flashcard does not exist', async () => {
      const id = 'non-existent-id'

      when(flashcardRepoMock.findOneBy(deepEqual({ id }))).thenResolve(null)

      await expect(flashcardsService.findOne(id)).rejects.toThrow(NotFoundException)

      verify(flashcardRepoMock.findOneBy(deepEqual({ id }))).once()
    })
  })

  describe('find', () => {
    it('should find all flashcards', async () => {
      const flashcards = [new Flashcard(), new Flashcard()]

      when(flashcardRepoMock.find()).thenResolve(flashcards)

      const result = await flashcardsService.find()

      expect(result).toEqual(flashcards)

      verify(flashcardRepoMock.find()).once()
    })
  })

  describe('update', () => {
    it('should update a flashcard', async () => {
      const id = 'some-id'
      const attrs: Partial<Flashcard> = {
        answer: 'An awesome Node.js framework'
      }

      const flashcard = new Flashcard()
      flashcard.id = id
      flashcard.question = 'What is NestJS?'
      flashcard.answer = 'A progressive Node.js framework'

      when(flashcardRepoMock.findOneBy(deepEqual({ id }))).thenResolve(flashcard)
      when(flashcardRepoMock.save(anything())).thenResolve(flashcard)

      const result = await flashcardsService.update(id, attrs)

      expect(result).toEqual(flashcard)
      expect(flashcard.answer).toEqual(attrs.answer)

      verify(flashcardRepoMock.findOneBy(deepEqual({ id }))).once()
      verify(flashcardRepoMock.save(flashcard)).once()
    })

    it('should throw NotFoundException if flashcard not found', async () => {
      const id = 'non-existent-id'
      const attrs: Partial<Flashcard> = {
        answer: 'An awesome Node.js framework'
      }

      when(flashcardRepoMock.findOneBy(deepEqual({ id }))).thenResolve(null)

      await expect(flashcardsService.update(id, attrs)).rejects.toThrow(NotFoundException)

      verify(flashcardRepoMock.findOneBy(deepEqual({ id }))).once()
      verify(flashcardRepoMock.save(anything())).never()
    })
  })

  describe('remove', () => {
    it('should remove a flashcard', async () => {
      const id = 'some-id'
      const flashcard = new Flashcard()
      flashcard.id = id

      when(flashcardRepoMock.findOneBy(deepEqual({ id }))).thenResolve(flashcard)
      when(flashcardRepoMock.remove(flashcard)).thenResolve(flashcard)

      const result = await flashcardsService.remove(id)

      expect(result).toEqual(flashcard)

      verify(flashcardRepoMock.findOneBy(deepEqual({ id }))).once()
      verify(flashcardRepoMock.remove(flashcard)).once()
    })

    it('should throw NotFoundException if flashcard not found', async () => {
      const id = 'non-existent-id'

      when(flashcardRepoMock.findOneBy(deepEqual({ id }))).thenResolve(null)

      await expect(flashcardsService.remove(id)).rejects.toThrow(NotFoundException)

      verify(flashcardRepoMock.findOneBy(deepEqual({ id }))).once()
      verify(flashcardRepoMock.remove(anything())).never()
    })
  })

  describe('reviewFlashcard', () => {
    it('should save a new FlashcardRevision when the flashcard exists and belongs to the user', async () => {
      const userId = 'user-id'
      const flashcardId = 'flashcard-id'
      const result = 1

      const flashcard = new Flashcard()

      flashcard.id = flashcardId
      flashcard.userId = userId

      when(
        flashcardRepoMock.findOne(deepEqual({ where: { id: flashcardId, userId } }))
      ).thenResolve(flashcard)

      when(flashcardRevisionRepoMock.save(anything())).thenResolve()

      await flashcardsService.reviewFlashcard(userId, flashcardId, result)

      verify(flashcardRepoMock.findOne(deepEqual({ where: { id: flashcardId, userId } }))).once()
      verify(flashcardRevisionRepoMock.save(anything())).once()
    })

    it('should throw an error when the flashcard does not exist or does not belong to the user', async () => {
      const userId = 'user-id'
      const flashcardId = 'flashcard-id'
      const result = 1

      when(
        flashcardRepoMock.findOne(deepEqual({ where: { id: flashcardId, userId } }))
      ).thenResolve(null)

      await expect(flashcardsService.reviewFlashcard(userId, flashcardId, result)).rejects.toThrow(
        Error
      )

      verify(flashcardRepoMock.findOne(deepEqual({ where: { id: flashcardId, userId } }))).once()
      verify(flashcardRevisionRepoMock.save(anything())).never()
    })
  })

  describe('getDueFlashcards', () => {
    it('should return flashcards with no revisions as due', async () => {
      const userId = 'user-id'

      const flashcards = [
        { id: 'flashcard-1', userId } as Flashcard,
        { id: 'flashcard-2', userId } as Flashcard
      ]

      when(flashcardRepoMock.find(deepEqual({ where: { userId } }))).thenResolve(flashcards)

      when(flashcardRevisionRepoMock.find(anything())).thenResolve([])

      const dueFlashcards = await flashcardsService.getDueFlashcards(userId)

      expect(dueFlashcards).toEqual(flashcards)

      verify(flashcardRepoMock.find(deepEqual({ where: { userId } }))).once()
      verify(flashcardRevisionRepoMock.find(anything())).times(flashcards.length)
    })

    it('should return flashcards that are due based on nextReviewDate', async () => {
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

      when(flashcardRepoMock.find(deepEqual({ where: { userId } }))).thenResolve(flashcards)
      when(
        flashcardRevisionRepoMock.find(
          deepEqual({
            where: { flashcardId: 'flashcard-1' },
            order: { createdAt: 'ASC' }
          })
        )
      ).thenResolve(revisions)
      when(userSettingsRepoMock.findOne(deepEqual({ where: { userId } }))).thenResolve(userSettings)

      const currentLevel = calculateCurrentIntervalLevel(revisions, userSettings.intervalsQuantity)

      const lastRevisionDate = revisions[revisions.length - 1].createdAt

      const nextReviewDate = calculateNextReviewDate(
        userSettings.baseInterval,
        userSettings.intervalIncreaseRate,
        currentLevel,
        lastRevisionDate
      )

      jest.useFakeTimers().setSystemTime(new Date(nextReviewDate.getTime() + 1))

      const dueFlashcards = await flashcardsService.getDueFlashcards(userId)

      expect(dueFlashcards).toHaveLength(1)
      expect(dueFlashcards[0]).toEqual({
        ...flashcards[0],
        currentLevel,
        nextReviewDate
      })

      verify(flashcardRepoMock.find(deepEqual({ where: { userId } }))).once()
      verify(flashcardRevisionRepoMock.find(anything())).once()
      verify(userSettingsRepoMock.findOne(deepEqual({ where: { userId } }))).once()

      jest.useRealTimers()
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

      when(flashcardRepoMock.find(deepEqual({ where: { userId } }))).thenResolve(flashcards)
      when(
        flashcardRevisionRepoMock.find(
          deepEqual({
            where: { flashcardId: 'flashcard-1' },
            order: { createdAt: 'ASC' }
          })
        )
      ).thenResolve(revisions)
      when(userSettingsRepoMock.findOne(deepEqual({ where: { userId } }))).thenResolve(userSettings)

      const currentLevel = calculateCurrentIntervalLevel(revisions, userSettings.intervalsQuantity)

      const lastRevisionDate = revisions[revisions.length - 1].createdAt

      const nextReviewDate = calculateNextReviewDate(
        userSettings.baseInterval,
        userSettings.intervalIncreaseRate,
        currentLevel,
        lastRevisionDate
      )

      jest.useFakeTimers().setSystemTime(new Date(nextReviewDate.getTime() - 1))

      const dueFlashcards = await flashcardsService.getDueFlashcards(userId)

      expect(dueFlashcards).toHaveLength(0)

      verify(flashcardRepoMock.find(deepEqual({ where: { userId } }))).once()
      verify(flashcardRevisionRepoMock.find(anything())).once()
      verify(userSettingsRepoMock.findOne(deepEqual({ where: { userId } }))).once()

      jest.useRealTimers()
    })
  })
})
