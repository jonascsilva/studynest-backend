import { Controller, Get, Param, Post, Delete, Patch, Body, Query } from '@nestjs/common'

import { Authenticated } from '$/auth/auth.decorator'
import { Serialize } from '$/interceptor/serialize.interceptor'
import { AiService } from '$/notes/ai.service'
import { CreateNoteDto } from '$/notes/dtos/create-note.dto'
import { GenerateNoteContentDto } from '$/notes/dtos/generate-note-content.dto'
import { NoteDto } from '$/notes/dtos/note.dto'
import { UpdateNoteDto } from '$/notes/dtos/update-note.dto'
import { Note } from '$/notes/note.entity'
import { NotesService } from '$/notes/notes.service'
import { RequestUser, ReqUser } from '$/users/user.decorator'

@Controller('notes')
@Serialize(NoteDto)
@Authenticated()
export class NotesController {
  constructor(
    private readonly notesService: NotesService,
    private readonly aiService: AiService
  ) {}

  @Get()
  findAllNotes(
    @ReqUser() user: RequestUser,
    @Query('shared') shared?: boolean,
    @Query('query') query?: string
  ): Promise<Note[]> {
    const userId = user.id

    if (shared) {
      return this.notesService.findShared(userId, query)
    }

    return this.notesService.find(userId)
  }

  @Get('/:id')
  async findNote(@ReqUser() user: RequestUser, @Param('id') id: string): Promise<Note> {
    return this.notesService.findOne(user.id, id)
  }

  @Post('/generate')
  generateNote(@Body() body: GenerateNoteContentDto): Promise<Partial<Note>> {
    return this.aiService.generateContent(body.subject, body.title)
  }

  @Post()
  createNote(@ReqUser() user: RequestUser, @Body() body: CreateNoteDto): Promise<Note> {
    return this.notesService.create(user.id, body)
  }

  @Patch('/:id')
  updateNote(
    @ReqUser() user: RequestUser,
    @Param('id') id: string,
    @Body() body: UpdateNoteDto
  ): Promise<Note> {
    return this.notesService.update(user.id, id, body)
  }

  @Delete('/:id')
  removeNote(@ReqUser() user: RequestUser, @Param('id') id: string): Promise<Note> {
    return this.notesService.remove(user.id, id)
  }
}
