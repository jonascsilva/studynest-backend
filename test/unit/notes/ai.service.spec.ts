import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { instance, mock } from 'ts-mockito'

import { AiService } from '$/notes/ai.service'
import { NotesService } from '$/notes/notes.service'

const textResponse = jest.fn()

jest.mock('@google/generative-ai', () => {
  return {
    SchemaType: {},
    GoogleGenerativeAI: jest.fn().mockImplementation(() => {
      return {
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: jest.fn().mockResolvedValue({
            response: {
              text: textResponse
            }
          })
        })
      }
    })
  }
})

describe('AiService', () => {
  let aiService: AiService
  let notesServiceMock: NotesService

  beforeEach(async () => {
    notesServiceMock = mock(NotesService)

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        ConfigService,
        {
          provide: NotesService,
          useValue: instance(notesServiceMock)
        }
      ]
    }).compile()

    aiService = module.get<AiService>(AiService)
  })

  it('should be defined', () => {
    expect(aiService).toBeDefined()
  })

  it('should generate a note', async () => {
    const title = 'The capital of France'
    const subject = 'Geography'

    const responseMock = {
      content: 'The capital of France is Paris'
    }

    textResponse.mockReturnValue(JSON.stringify(responseMock))

    const result = await aiService.generateContent(subject, title)

    expect(result).toEqual(responseMock)
  })
})
