import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { Note } from '$/notes/note.entity'

const schema1 = {
  type: SchemaType.OBJECT,
  properties: {
    content: {
      type: SchemaType.STRING
    }
  },
  required: ['content']
}

@Injectable()
export class AiService {
  constructor(private readonly configService: ConfigService) {}

  async generateContent(subject: string, title: string): Promise<Partial<Note>> {
    const genAI = new GoogleGenerativeAI(this.configService.get('AI_KEY'))

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: schema1
      }
    })

    const prompt = `
      Gere o conteúdo (em português) de uma anotação (documento) sobre o seguinte assunto: "${subject}" e com o seguinte título: "${title}".
      O conteúdo deve ser bem completo.
    `

    const generatedContent = await model.generateContent(prompt)

    const json = JSON.parse(generatedContent.response.text())

    return json
  }
}