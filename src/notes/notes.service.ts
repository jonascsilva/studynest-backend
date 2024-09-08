import { Injectable } from '@nestjs/common'
import { Note as NoteModel } from '@prisma/client'

import { PrismaService } from 'src/prisma.service'

@Injectable()
export class NotesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllNotes(): Promise<NoteModel[]> {
    return this.prismaService.note.findMany()
  }
}
