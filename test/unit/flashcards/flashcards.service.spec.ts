import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { Flashcard } from '$/flashcards/flashcard.entity'
import { FlashcardsService } from '$/flashcards/flashcards.service'

import { FlashcardsRepositoryMock } from './flashcards.repository.mock'

describe('FlashcardsService', () => {
  let flashcardsService: FlashcardsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlashcardsService,
        {
          provide: getRepositoryToken(Flashcard),
          useClass: FlashcardsRepositoryMock
        }
      ]
    }).compile()

    flashcardsService = module.get<FlashcardsService>(FlashcardsService)
  })

  it('should be defined', () => {
    expect(flashcardsService).toBeDefined()
  })
})
