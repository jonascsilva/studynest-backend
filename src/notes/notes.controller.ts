import { Controller, Get, Param } from '@nestjs/common'
import { NotesService } from '$/notes/notes.service'

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  getAllNotes(): string {
    return this.notesService.getAllNotes()
  }

  @Get('/:id')
  getNote(@Param('id') id: string): string {
    return this.notesService.getNote(id)
  }
}
