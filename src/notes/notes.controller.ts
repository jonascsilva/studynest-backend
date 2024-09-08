import { Controller, Get } from '@nestjs/common'
import { Note as NoteModel } from '@prisma/client'

import { NotesService } from 'src/notes/notes.service'

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  getAllNotes(): Promise<NoteModel[]> {
    return this.notesService.getAllNotes()
  }
}
