import { Test, TestingModule } from '@nestjs/testing'
import { instance, mock, when, verify, deepEqual } from 'ts-mockito'

import { AiService } from '$/flashcards/ai.service'
import { CreateFlashcardDto } from '$/flashcards/dtos/create-flashcard.dto'
import { UpdateFlashcardDto } from '$/flashcards/dtos/update-flashcard.dto'
import { Flashcard } from '$/flashcards/flashcard.entity'
import { FlashcardsController } from '$/flashcards/flashcards.controller'
import { FlashcardsService } from '$/flashcards/flashcards.service'

import { dueFlashcardsMock, flashcardsMock, upcomingFlashcardsMock } from './flashcards.mock'

describe('FlashcardsController', () => {
  let flashcardsController: FlashcardsController
  let flashcardsServiceMock: FlashcardsService
  let aiServiceMock: AiService

  beforeEach(async () => {
    flashcardsServiceMock = mock(FlashcardsService)
    aiServiceMock = mock(AiService)

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlashcardsController],
      providers: [
        {
          provide: FlashcardsService,
          useValue: instance(flashcardsServiceMock)
        },
        {
          provide: AiService,
          useValue: instance(aiServiceMock)
        }
      ]
    }).compile()

    flashcardsController = module.get<FlashcardsController>(FlashcardsController)
  })

  it('should be defined', () => {
    expect(flashcardsController).toBeDefined()
  })

  describe('createFlashcard', () => {
    it('should create a new flashcard', async () => {
      const body: CreateFlashcardDto = {
        question: 'What is NestJS?',
        answer: 'A progressive Node.js framework',
        subject: 'Programming',
        userId: '8f82aa4e-57fb-4e07-9928-3616edcf45c0'
      }

      const flashcard = new Flashcard()

      Object.assign(flashcard, body)

      when(flashcardsServiceMock.create(body)).thenResolve(flashcard)

      const result = await flashcardsController.createFlashcard(body)

      expect(result).toEqual(flashcard)

      verify(flashcardsServiceMock.create(deepEqual(body))).once()
    })
  })

  describe('getAllFlashcards', () => {
    it('should return all flashcards', async () => {
      const userId = 'fake-id'
      const user = {
        email: 'fake-email',
        name: 'fake-name',
        id: userId
      }

      const flashcards = [flashcardsMock[0], flashcardsMock[1]]

      when(flashcardsServiceMock.find(userId)).thenResolve(flashcards)

      const result = await flashcardsController.getAllFlashcards(user)

      expect(result).toEqual(flashcards)
      verify(flashcardsServiceMock.find(userId)).once()
    })

    it('should return all due flashcards', async () => {
      const userId = 'fake-user-id'

      const user = {
        email: 'fake-email',
        name: 'fake-name',
        id: userId
      }

      when(flashcardsServiceMock.getFlashcardsWithReviews(userId)).thenResolve({
        dueFlashcards: dueFlashcardsMock,
        upcomingFlashcards: upcomingFlashcardsMock
      })

      const result = await flashcardsController.getAllFlashcards(user, 'true')

      expect(result).toEqual(dueFlashcardsMock)

      verify(flashcardsServiceMock.getFlashcardsWithReviews(userId)).once()
    })

    it('should return all upcoming flashcards', async () => {
      const userId = 'fake-user-id'

      const user = {
        email: 'fake-email',
        name: 'fake-name',
        id: userId
      }

      when(flashcardsServiceMock.getFlashcardsWithReviews(userId)).thenResolve({
        dueFlashcards: dueFlashcardsMock,
        upcomingFlashcards: upcomingFlashcardsMock
      })

      const result = await flashcardsController.getAllFlashcards(user, undefined, 'true')

      expect(result).toEqual(upcomingFlashcardsMock)

      verify(flashcardsServiceMock.getFlashcardsWithReviews(userId)).once()
    })

    it('should return all due and upcoming flashcards', async () => {
      const userId = 'fake-user-id'

      const user = {
        email: 'fake-email',
        name: 'fake-name',
        id: userId
      }

      when(flashcardsServiceMock.getFlashcardsWithReviews(userId)).thenResolve({
        dueFlashcards: dueFlashcardsMock,
        upcomingFlashcards: upcomingFlashcardsMock
      })

      const result = await flashcardsController.getAllFlashcards(user, 'true', 'true')

      expect(result).toEqual([...dueFlashcardsMock, ...upcomingFlashcardsMock])

      verify(flashcardsServiceMock.getFlashcardsWithReviews(userId)).once()
    })
  })

  describe('generateFlashcard', () => {
    it('should generate a flashcard using AI', async () => {
      const partialFlashcard: Partial<Flashcard> = {
        question: 'What is the capital of France?',
        answer: 'Paris',
        subject: 'Geography'
      }

      when(aiServiceMock.generate()).thenResolve(partialFlashcard)

      const result = await flashcardsController.generateFlashcard()

      expect(result).toEqual(partialFlashcard)
      verify(aiServiceMock.generate()).once()
    })
  })

  describe('findFlashcard', () => {
    it('should return the flashcard when it exists', async () => {
      const id = 'some-id'

      when(flashcardsServiceMock.findOne(id)).thenResolve(flashcardsMock[0])

      const result = await flashcardsController.findFlashcard(id)

      expect(result).toEqual(flashcardsMock[0])
      verify(flashcardsServiceMock.findOne(id)).once()
    })
  })

  describe('updateFlashcard', () => {
    it('should update and return the flashcard', async () => {
      const id = 'some-id'
      const body: UpdateFlashcardDto = {
        answer: 'An updated answer'
      }

      const updatedFlashcard = { ...flashcardsMock[0] }

      updatedFlashcard.id = id
      updatedFlashcard.answer = body.answer

      when(flashcardsServiceMock.update(id, body)).thenResolve(updatedFlashcard)

      const result = await flashcardsController.updateFlashcard(id, body)

      expect(result).toEqual(updatedFlashcard)

      verify(flashcardsServiceMock.update(id, deepEqual(body))).once()
    })
  })

  describe('removeFlashcard', () => {
    it('should remove and return the flashcard', async () => {
      const id = 'some-id'

      when(flashcardsServiceMock.remove(id)).thenResolve(flashcardsMock[0])

      const result = await flashcardsController.removeFlashcard(id)

      expect(result).toEqual(flashcardsMock[0])

      verify(flashcardsServiceMock.remove(id)).once()
    })
  })

  describe('review', () => {
    it('should create a flashcard review', async () => {
      const userId = 'fake-user-id'
      const flashcardId = 'fake-flashcard-id'
      const reviewResult = 1
      const body = {
        flashcardId,
        result: reviewResult
      }

      when(flashcardsServiceMock.reviewFlashcard(userId, flashcardId, reviewResult)).thenResolve(
        undefined
      )

      const user = {
        name: 'fake-name',
        email: 'fake-email',
        id: userId
      }

      const result = await flashcardsController.review(user, flashcardId, body)

      expect(result).toEqual(undefined)

      verify(flashcardsServiceMock.reviewFlashcard(userId, flashcardId, reviewResult)).once()
    })
  })
})
