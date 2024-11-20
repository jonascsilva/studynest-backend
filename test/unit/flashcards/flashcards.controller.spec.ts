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
  const userId = 'fake-user-id'
  const requestUser = {
    email: 'fake-email',
    name: 'fake-name',
    id: userId
  }

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
        subject: 'Programming'
      }

      const flashcard = new Flashcard()

      Object.assign(flashcard, body)

      when(flashcardsServiceMock.create(userId, body)).thenResolve(flashcard)

      const result = await flashcardsController.createFlashcard(requestUser, body)

      expect(result).toEqual(flashcard)

      verify(flashcardsServiceMock.create(userId, deepEqual(body))).once()
    })
  })

  describe('getAllFlashcards', () => {
    it('should return all flashcards', async () => {
      const flashcards = [flashcardsMock[0], flashcardsMock[1]]

      when(flashcardsServiceMock.find(userId)).thenResolve(flashcards)

      const result = await flashcardsController.getAllFlashcards(requestUser)

      expect(result).toEqual(flashcards)
      verify(flashcardsServiceMock.find(userId)).once()
    })

    it('should return all due flashcards', async () => {
      when(flashcardsServiceMock.getFlashcardsWithReviews(userId)).thenResolve({
        dueFlashcards: dueFlashcardsMock,
        upcomingFlashcards: upcomingFlashcardsMock
      })

      const result = await flashcardsController.getAllFlashcards(requestUser, 'true')

      expect(result).toEqual(dueFlashcardsMock)

      verify(flashcardsServiceMock.getFlashcardsWithReviews(userId)).once()
    })

    it('should return all upcoming flashcards', async () => {
      when(flashcardsServiceMock.getFlashcardsWithReviews(userId)).thenResolve({
        dueFlashcards: dueFlashcardsMock,
        upcomingFlashcards: upcomingFlashcardsMock
      })

      const result = await flashcardsController.getAllFlashcards(requestUser, undefined, 'true')

      expect(result).toEqual(upcomingFlashcardsMock)

      verify(flashcardsServiceMock.getFlashcardsWithReviews(userId)).once()
    })

    it('should return all due and upcoming flashcards', async () => {
      when(flashcardsServiceMock.getFlashcardsWithReviews(userId)).thenResolve({
        dueFlashcards: dueFlashcardsMock,
        upcomingFlashcards: upcomingFlashcardsMock
      })

      const result = await flashcardsController.getAllFlashcards(requestUser, 'true', 'true')

      expect(result).toEqual([...dueFlashcardsMock, ...upcomingFlashcardsMock])

      verify(flashcardsServiceMock.getFlashcardsWithReviews(userId)).once()
    })
  })

  describe('generateFlashcard', () => {
    it('should generate a flashcard using AI', async () => {
      const subject = 'Geography'
      const question = 'What is the capital of France?'

      const partialFlashcard: Partial<Flashcard> = {
        answer: 'Paris'
      }

      when(aiServiceMock.generateContent(subject, question)).thenResolve(partialFlashcard)

      const result = await flashcardsController.generateFlashcard({ subject, question })

      expect(result).toEqual(partialFlashcard)

      verify(aiServiceMock.generateContent(subject, question)).once()
    })
  })

  describe('generateFlashcards', () => {
    it('should generate flashcards from a note using AI', async () => {
      const noteId = 'fake-note-id'

      const responseMock = [
        {
          question: 'What is the capital of France?',
          subject: 'Geography',
          answer: 'Paris'
        }
      ]

      when(aiServiceMock.generateFlashcards(userId, noteId)).thenResolve(responseMock)

      const result = await flashcardsController.generateFlashcards(requestUser, noteId)

      expect(result).toEqual(responseMock)

      verify(aiServiceMock.generateFlashcards(userId, noteId)).once()
    })
  })

  describe('findFlashcard', () => {
    it('should return the flashcard when it exists', async () => {
      const id = 'fake-flashcard-id'

      when(flashcardsServiceMock.findOne(userId, id)).thenResolve(flashcardsMock[0])

      const result = await flashcardsController.findFlashcard(requestUser, id)

      expect(result).toEqual(flashcardsMock[0])
      verify(flashcardsServiceMock.findOne(userId, id)).once()
    })
  })

  describe('updateFlashcard', () => {
    it('should update and return the flashcard', async () => {
      const id = 'fake-flashcard-id'

      const body: UpdateFlashcardDto = {
        answer: 'An updated answer'
      }

      const updatedFlashcard = { ...flashcardsMock[0] }

      updatedFlashcard.id = id
      updatedFlashcard.answer = body.answer

      when(flashcardsServiceMock.update(userId, id, body)).thenResolve(updatedFlashcard)

      const result = await flashcardsController.updateFlashcard(requestUser, id, body)

      expect(result).toEqual(updatedFlashcard)

      verify(flashcardsServiceMock.update(userId, id, deepEqual(body))).once()
    })
  })

  describe('removeFlashcard', () => {
    it('should remove and return the flashcard', async () => {
      const id = 'fake-flashcard-id'

      when(flashcardsServiceMock.remove(userId, id)).thenResolve(flashcardsMock[0])

      const result = await flashcardsController.removeFlashcard(requestUser, id)

      expect(result).toEqual(flashcardsMock[0])

      verify(flashcardsServiceMock.remove(userId, id)).once()
    })
  })

  describe('review', () => {
    it('should create a flashcard review', async () => {
      const flashcardId = 'fake-flashcard-id'
      const reviewResult = 1
      const body = {
        flashcardId,
        result: reviewResult
      }

      when(flashcardsServiceMock.reviewFlashcard(userId, flashcardId, reviewResult)).thenResolve(
        undefined
      )

      const result = await flashcardsController.review(requestUser, flashcardId, body)

      expect(result).toEqual(undefined)

      verify(flashcardsServiceMock.reviewFlashcard(userId, flashcardId, reviewResult)).once()
    })
  })
})
