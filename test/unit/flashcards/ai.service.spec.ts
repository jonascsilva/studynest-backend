import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'

import { AiService } from '$/flashcards/ai.service'

jest.mock('@google/generative-ai', () => {
  return {
    SchemaType: {
      OBJECT: 'object',
      STRING: 'string'
    },
    GoogleGenerativeAI: jest.fn().mockImplementation(() => {
      return {
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: jest.fn().mockResolvedValue({
            response: {
              text: jest.fn().mockReturnValue(
                JSON.stringify({
                  question: 'What is the capital of France?',
                  answer: 'Paris',
                  subject: 'Geography'
                })
              )
            }
          })
        })
      }
    })
  }
})

describe('AiService', () => {
  let aiService: AiService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiService, ConfigService]
    }).compile()

    aiService = module.get<AiService>(AiService)
  })

  it('should be defined', () => {
    expect(aiService).toBeDefined()
  })

  it('should generate a flashcard', async () => {
    const result = await aiService.generate()

    expect(result).toEqual({
      question: 'What is the capital of France?',
      answer: 'Paris',
      subject: 'Geography'
    })
  })
})
