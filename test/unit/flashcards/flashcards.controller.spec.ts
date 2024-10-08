import { Test, TestingModule } from '@nestjs/testing'

import { FlashcardsController } from '$/flashcards/flashcards.controller'
import { FlashcardsService } from '$/flashcards/flashcards.service'

import { FlashcardsServiceMock } from './flashcards.service.mock'

describe('FlashcardsController', () => {
  let flashcardsController: FlashcardsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlashcardsController],
      providers: [
        {
          provide: FlashcardsService,
          useClass: FlashcardsServiceMock
        }
      ]
    }).compile()

    flashcardsController = module.get<FlashcardsController>(FlashcardsController)
  })

  it('should be defined', () => {
    expect(flashcardsController).toBeDefined()
  })
})
