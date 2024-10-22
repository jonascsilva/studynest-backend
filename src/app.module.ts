import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AppController } from '$/app.controller'
import { AppService } from '$/app.service'
import { AuthModule } from '$/auth/auth.module'
import { FlashcardRevision } from '$/flashcards/flashcard-revision.entity'
import { Flashcard } from '$/flashcards/flashcard.entity'
import { FlashcardsModule } from '$/flashcards/flashcards.module'
import { Note } from '$/notes/note.entity'
import { NotesModule } from '$/notes/notes.module'
import { User } from '$/users/user.entity'
import { UsersModule } from '$/users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, `.env.${process.env.NODE_ENV}.local`]
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Note, User, Flashcard, FlashcardRevision],
      ssl: true,
      synchronize: true
    }),
    UsersModule,
    NotesModule,
    FlashcardsModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
