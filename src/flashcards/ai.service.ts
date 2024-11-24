import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { Flashcard } from '$/flashcards/flashcard.entity'
import { NotesService } from '$/notes/notes.service'

const schema1 = {
  type: SchemaType.OBJECT,
  properties: {
    answer: {
      type: SchemaType.STRING
    }
  },
  required: ['answer']
}

const schema2 = {
  type: SchemaType.OBJECT,
  properties: {
    flashcards: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          question: {
            type: SchemaType.STRING
          },
          subject: {
            type: SchemaType.STRING
          },
          answer: {
            type: SchemaType.STRING
          }
        },
        required: ['question', 'subject', 'answer']
      }
    }
  },
  required: ['flashcards']
}

@Injectable()
export class AiService {
  constructor(
    private readonly configService: ConfigService,
    private readonly notesService: NotesService
  ) {}

  async generateContent(subject: string, question: string): Promise<Partial<Flashcard>> {
    const genAI = new GoogleGenerativeAI(this.configService.get('AI_KEY'))

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: schema1
      }
    })

    const prompt = `
      Gere a resposta do flashcard (em português) sobre o seguinte assunto: "${subject}" e com a seguinte pergunta: "${question}".
      A resposta deve ser bem objetiva.
    `

    const generatedContent = await model.generateContent(prompt)

    const flashcard = JSON.parse(generatedContent.response.text())

    return flashcard
  }

  async generateFlashcards(userId: string, noteId: string) {
    const note = await this.notesService.findOne(userId, noteId)

    const genAI = new GoogleGenerativeAI(this.configService.get('AI_KEY'))

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: schema2
      }
    })

    const quantity = Math.ceil(note.content.length / 500)

    const prompt = `
      Gere exatamente ${quantity} flashcards (em português) com base na anotação (documento) a seguir.
      Os flashcards devem ser objetivos e devem conter: question (Pergunta), subject (assunto) e answer (resposta):
      O assunto da anotação é: "${note.subject}", o título é: "${note.title}" e o conteúdo é "${note.content}".
    `

    const generatedContent = await model.generateContent(prompt)

    const { flashcards } = JSON.parse(generatedContent.response.text())

    return flashcards
  }
}
