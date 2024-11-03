import { Test, TestingModule } from '@nestjs/testing'
import { instance, mock, when, verify, deepEqual } from 'ts-mockito'

import { AiService } from '$/flashcards/ai.service'
import { CreateFlashcardDto } from '$/flashcards/dtos/create-flashcard.dto'
import { UpdateFlashcardDto } from '$/flashcards/dtos/update-flashcard.dto'
import { Flashcard } from '$/flashcards/flashcard.entity'
import { FlashcardsController } from '$/flashcards/flashcards.controller'
import { FlashcardsService } from '$/flashcards/flashcards.service'
import { User } from '$/users/user.entity'

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
      const flashcards = [new Flashcard(), new Flashcard()]

      when(flashcardsServiceMock.find()).thenResolve(flashcards)

      const result = await flashcardsController.getAllFlashcards()

      expect(result).toEqual(flashcards)
      verify(flashcardsServiceMock.find()).once()
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
      const flashcard = new Flashcard()

      flashcard.id = id

      when(flashcardsServiceMock.findOne(id)).thenResolve(flashcard)

      const result = await flashcardsController.findFlashcard(id)

      expect(result).toEqual(flashcard)
      verify(flashcardsServiceMock.findOne(id)).once()
    })
  })

  describe('updateFlashcard', () => {
    it('should update and return the flashcard', async () => {
      const id = 'some-id'
      const body: UpdateFlashcardDto = {
        answer: 'An updated answer'
      }

      const updatedFlashcard = new Flashcard()

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
      const flashcard = new Flashcard()

      flashcard.id = id

      when(flashcardsServiceMock.remove(id)).thenResolve(flashcard)

      const result = await flashcardsController.removeFlashcard(id)

      expect(result).toEqual(flashcard)

      verify(flashcardsServiceMock.remove(id)).once()
    })
  })

  describe('getDue', () => {
    it('should return all due flashcards', async () => {
      const userId = 'fake-user-id'

      const user = new User()

      user.id = userId

      const req = { user }

      const flashcard1 = new Flashcard()

      flashcard1.id = 'fake-id-1'

      const flashcard2 = new Flashcard()

      flashcard2.id = 'fake-id-1'

      const flashcards: Flashcard[] = [flashcard1, flashcard2]

      when(flashcardsServiceMock.getDueFlashcards(userId)).thenResolve(flashcards)

      const result = await flashcardsController.getDueFlashcards(req)

      expect(result).toEqual(flashcards)

      verify(flashcardsServiceMock.getDueFlashcards(userId)).once()
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

      const user = new User()

      user.id = userId

      const req = { user }

      const result = await flashcardsController.review(req, body)

      expect(result).toEqual(undefined)

      verify(flashcardsServiceMock.reviewFlashcard(userId, flashcardId, reviewResult)).once()
    })
  })
})
