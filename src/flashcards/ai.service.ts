import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { Flashcard } from '$/flashcards/flashcard.entity'

const schema = {
  type: SchemaType.OBJECT,
  properties: {
    question: {
      type: SchemaType.STRING
    },
    answer: {
      type: SchemaType.STRING
    },
    subject: {
      type: SchemaType.STRING
    }
  },
  required: ['question', 'answer', 'subject']
}

@Injectable()
export class AiService {
  constructor(private readonly configService: ConfigService) {}

  async generate(): Promise<Partial<Flashcard>> {
    const genAI = new GoogleGenerativeAI(this.configService.get('AI_KEY'))

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: schema
      }
    })

    const prompt = 'Crie um flashcard (e somente um) sobre algum conteúdo do ensino médio'

    const result = await model.generateContent(prompt)

    const json = JSON.parse(result.response.text())

    return json
  }
}
