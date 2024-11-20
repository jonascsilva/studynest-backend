import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { instance, mock, when } from 'ts-mockito'

import { AiService } from '$/flashcards/ai.service'
import { Note } from '$/notes/note.entity'
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

  it('should generate a flashcard', async () => {
    const question = 'What is the capital of France?'
    const subject = 'Geography'

    const responseMock = {
      answer: 'Paris'
    }

    textResponse.mockReturnValue(JSON.stringify(responseMock))

    const result = await aiService.generateContent(subject, question)

    expect(result).toEqual(responseMock)
  })

  it('should generate flashcards from a note', async () => {
    const userId = 'fake-user-id'
    const noteId = 'fake-note-id'

    const responseMock = {
      flashcards: [
        {
          question: 'What is the capital of France?',
          subject: 'Geography',
          answer: 'Paris'
        }
      ]
    }

    textResponse.mockReturnValue(JSON.stringify(responseMock))

    const noteMock = {
      title: 'Geography of France',
      subject: 'Geography',
      content: 'The capital o France is Paris'
    } as Note

    when(notesServiceMock.findOne(userId, noteId)).thenResolve(noteMock)

    const result = await aiService.generateFlashcards(userId, noteId)

    expect(result).toEqual(responseMock.flashcards)
  })
})
