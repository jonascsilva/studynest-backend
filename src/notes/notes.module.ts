import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AiService } from '$/notes/ai.service'
import { Note } from '$/notes/note.entity'
import { NotesController } from '$/notes/notes.controller'
import { NotesService } from '$/notes/notes.service'

@Module({
  imports: [TypeOrmModule.forFeature([Note])],
  controllers: [NotesController],
  providers: [NotesService, AiService]
})
export class NotesModule {}
