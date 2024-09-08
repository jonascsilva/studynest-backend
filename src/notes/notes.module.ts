import { Module } from '@nestjs/common'
import { NotesController } from 'src/notes/notes.controller'
import { NotesService } from 'src/notes/notes.service'
import { PrismaService } from 'src/prisma.service'

@Module({
  controllers: [NotesController],
  providers: [NotesService, PrismaService]
})
export class NotesModule {}
