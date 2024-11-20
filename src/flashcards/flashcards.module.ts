import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AiService } from '$/flashcards/ai.service'
import { FlashcardRevision } from '$/flashcards/flashcard-revision.entity'
import { Flashcard } from '$/flashcards/flashcard.entity'
import { FlashcardsController } from '$/flashcards/flashcards.controller'
import { FlashcardsService } from '$/flashcards/flashcards.service'
import { Note } from '$/notes/note.entity'
import { NotesService } from '$/notes/notes.service'
import { UserSettings } from '$/settings/user-settings.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Flashcard]),
    TypeOrmModule.forFeature([FlashcardRevision]),
    TypeOrmModule.forFeature([UserSettings]),
    TypeOrmModule.forFeature([Note])
  ],
  providers: [FlashcardsService, AiService, NotesService],
  controllers: [FlashcardsController]
})
export class FlashcardsModule {}
