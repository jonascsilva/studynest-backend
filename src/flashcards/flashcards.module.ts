import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Flashcard } from '$/flashcards/flashcard.entity'
import { FlashcardsController } from '$/flashcards/flashcards.controller'
import { FlashcardsService } from '$/flashcards/flashcards.service'

@Module({
  imports: [TypeOrmModule.forFeature([Flashcard])],
  providers: [FlashcardsService],
  controllers: [FlashcardsController]
})
export class FlashcardsModule {}
