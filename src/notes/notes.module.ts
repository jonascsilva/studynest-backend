import { Module } from '@nestjs/common'
import { NotesController } from '$/notes/notes.controller'
import { NotesService } from '$/notes/notes.service'
import { PrismaService } from '$/prisma.service'

@Module({
  controllers: [NotesController],
  providers: [NotesService, PrismaService]
})
export class NotesModule {}
