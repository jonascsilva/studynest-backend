import { Module } from '@nestjs/common'

import { AppController } from 'src/app.controller'
import { AppService } from 'src/app.service'
import { NotesModule } from 'src/notes/notes.module'

@Module({
  imports: [NotesModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
