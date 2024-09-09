import { Controller, Get, Param } from '@nestjs/common'
import { Note as NoteModel } from '@prisma/client'

import { NotesService } from '$/notes/notes.service'

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  getAllNotes(): Promise<NoteModel[]> {
    return this.notesService.getAllNotes()
  }

  @Get('/:id')
  getNote(@Param('id') id: string): Promise<NoteModel> {
    return this.notesService.getNote(id)
  }
}
