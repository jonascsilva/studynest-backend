import { AppController } from '$/app.controller'
import { AppService } from '$/app.service'
import { Module } from '@nestjs/common'
import { NotesModule } from '$/notes/notes.module'

@Module({
  imports: [NotesModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
