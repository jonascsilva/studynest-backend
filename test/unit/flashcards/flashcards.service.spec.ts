import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { instance, mock, when, verify, anything, deepEqual } from 'ts-mockito'
import { Repository } from 'typeorm'

import { Flashcard } from '$/flashcards/flashcard.entity'
import { FlashcardsService } from '$/flashcards/flashcards.service'

describe('FlashcardsService', () => {
  let flashcardsService: FlashcardsService
  let flashcardsRepositoryMock: Repository<Flashcard>

  beforeEach(async () => {
    flashcardsRepositoryMock = mock(Repository<Flashcard>)

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlashcardsService,
        {
          provide: getRepositoryToken(Flashcard),
          useValue: instance(flashcardsRepositoryMock)
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

      when(flashcardsRepositoryMock.create(attrs)).thenReturn(flashcard)
      when(flashcardsRepositoryMock.save(flashcard)).thenResolve(flashcard)

      const result = await flashcardsService.create(attrs)

      expect(result).toEqual(flashcard)

      verify(flashcardsRepositoryMock.create(attrs)).once()
      verify(flashcardsRepositoryMock.save(flashcard)).once()
    })
  })

  describe('findOne', () => {
    it('should find a flashcard by id', async () => {
      const id = 'some-id'
      const flashcard = new Flashcard()
      flashcard.id = id

      when(flashcardsRepositoryMock.findOneBy(deepEqual({ id }))).thenResolve(flashcard)

      const result = await flashcardsService.findOne(id)

      expect(result).toEqual(flashcard)
      verify(flashcardsRepositoryMock.findOneBy(deepEqual({ id }))).once()
    })
  })

  describe('find', () => {
    it('should find all flashcards', async () => {
      const flashcards = [new Flashcard(), new Flashcard()]

      when(flashcardsRepositoryMock.find()).thenResolve(flashcards)

      const result = await flashcardsService.find()

      expect(result).toEqual(flashcards)

      verify(flashcardsRepositoryMock.find()).once()
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

      when(flashcardsRepositoryMock.findOneBy(deepEqual({ id }))).thenResolve(flashcard)
      when(flashcardsRepositoryMock.save(anything())).thenResolve(flashcard)

      const result = await flashcardsService.update(id, attrs)

      expect(result).toEqual(flashcard)
      expect(flashcard.answer).toEqual(attrs.answer)

      verify(flashcardsRepositoryMock.findOneBy(deepEqual({ id }))).once()
      verify(flashcardsRepositoryMock.save(flashcard)).once()
    })

    it('should throw NotFoundException if flashcard not found', async () => {
      const id = 'non-existent-id'
      const attrs: Partial<Flashcard> = {
        answer: 'An awesome Node.js framework'
      }

      when(flashcardsRepositoryMock.findOneBy({ id })).thenResolve(null)

      await expect(flashcardsService.update(id, attrs)).rejects.toThrow(NotFoundException)

      verify(flashcardsRepositoryMock.findOneBy(deepEqual({ id }))).once()
      verify(flashcardsRepositoryMock.save(anything())).never()
    })
  })

  describe('remove', () => {
    it('should remove a flashcard', async () => {
      const id = 'some-id'
      const flashcard = new Flashcard()
      flashcard.id = id

      when(flashcardsRepositoryMock.findOneBy(deepEqual({ id }))).thenResolve(flashcard)
      when(flashcardsRepositoryMock.remove(flashcard)).thenResolve(flashcard)

      const result = await flashcardsService.remove(id)

      expect(result).toEqual(flashcard)

      verify(flashcardsRepositoryMock.findOneBy(deepEqual({ id }))).once()
      verify(flashcardsRepositoryMock.remove(flashcard)).once()
    })

    it('should throw NotFoundException if flashcard not found', async () => {
      const id = 'non-existent-id'

      when(flashcardsRepositoryMock.findOneBy(deepEqual({ id }))).thenResolve(null)

      await expect(flashcardsService.remove(id)).rejects.toThrow(NotFoundException)

      verify(flashcardsRepositoryMock.findOneBy(deepEqual({ id }))).once()
      verify(flashcardsRepositoryMock.remove(anything())).never()
    })
  })
})
