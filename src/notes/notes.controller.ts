import { Controller, Get, Param, Post, Delete, Patch, Body } from '@nestjs/common'

import { Serialize } from '$/interceptor/serialize.interceptor'
import { CreateNoteDto } from '$/notes/dtos/create-note.dto'
import { NoteDto } from '$/notes/dtos/note.dto'
import { UpdateNoteDto } from '$/notes/dtos/update-note.dto'
import { Note } from '$/notes/note.entity'
import { NotesService } from '$/notes/notes.service'

@Controller('notes')
@Serialize(NoteDto)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  findAllNotes(): Promise<Note[]> {
    return this.notesService.find()
  }

  @Get('/:id')
  async findNote(@Param('id') id: string): Promise<Note> {
    return this.notesService.findOne(id)
  }

  @Post()
  createNote(@Body() body: CreateNoteDto): Promise<Note> {
    return this.notesService.create(body)
  }

  @Patch('/:id')
  updateNote(@Param('id') id: string, @Body() body: UpdateNoteDto): Promise<Note> {
    return this.notesService.update(id, body)
  }

  @Delete('/:id')
  removeNote(@Param('id') id: string): Promise<Note> {
    return this.notesService.remove(id)
  }
}
