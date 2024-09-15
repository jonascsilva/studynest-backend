import { Controller, Get, Param } from '@nestjs/common'

import { Note } from '$/notes/note.entity'
import { NotesService } from '$/notes/notes.service'

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  getAllNotes(): Promise<Note[]> {
    return this.notesService.getAllNotes()
  }

  @Get('/:id')
  getNote(@Param('id') id: string): Promise<Note> {
    return this.notesService.getNote(id)
  }
}
