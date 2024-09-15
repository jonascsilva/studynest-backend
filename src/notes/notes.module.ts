import { Module } from '@nestjs/common'
import { Note } from '$/notes/note.entity'
import { NotesController } from '$/notes/notes.controller'
import { NotesService } from '$/notes/notes.service'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([Note])],
  controllers: [NotesController],
  providers: [NotesService]
})
export class NotesModule {}
