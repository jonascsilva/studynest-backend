import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AppController } from '$/app.controller'
import { AppService } from '$/app.service'
import { FlashcardRevision } from '$/flashcards/flashcard-revision.entity'
import { Flashcard } from '$/flashcards/flashcard.entity'
import { FlashcardsModule } from '$/flashcards/flashcards.module'
import { Note } from '$/notes/note.entity'
import { NotesModule } from '$/notes/notes.module'
import { User } from '$/users/user.entity'
import { UsersModule } from '$/users/users.module'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ep-white-recipe-a4nzv9nx.us-east-1.aws.neon.tech',
      port: 5432,
      username: 'studynest_owner',
      password: '9SuvcNgdt7Pq',
      database: 'studynest',
      entities: [Note, User, Flashcard, FlashcardRevision],
      synchronize: true,
      ssl: true
    }),
    UsersModule,
    NotesModule,
    FlashcardsModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
