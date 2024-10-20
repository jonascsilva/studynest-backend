import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  Body,
  NotFoundException
} from '@nestjs/common'

import { CreateFlashcardDto } from '$/flashcards/dtos/create-flashcard.dto'
import { FlashcardDto } from '$/flashcards/dtos/flashcard.dto'
import { UpdateFlashcardDto } from '$/flashcards/dtos/update-flashcard.dto'
import { Flashcard } from '$/flashcards/flashcard.entity'
import { FlashcardsService } from '$/flashcards/flashcards.service'
import { Serialize } from '$/interceptor/serialize.interceptor'

@Controller('flashcards')
@Serialize(FlashcardDto)
export class FlashcardsController {
  constructor(private readonly flashcardsService: FlashcardsService) {}

  @Post()
  createFlashcard(@Body() body: CreateFlashcardDto): Promise<Flashcard> {
    return this.flashcardsService.create(body)
  }

  @Get()
  getAllFlashcards(): Promise<Flashcard[]> {
    return this.flashcardsService.find()
  }

  @Get('/:id')
  async findFlashcard(@Param('id') id: string): Promise<Flashcard> {
    const flashcard = await this.flashcardsService.findOne(id)

    if (!flashcard) {
      throw new NotFoundException('Flashcard not found')
    }

    return flashcard
  }

  @Patch('/:id')
  updateFlashcard(@Param('id') id: string, @Body() body: UpdateFlashcardDto): Promise<Flashcard> {
    return this.flashcardsService.update(id, body)
  }

  @Delete('/:id')
  removeFlashcard(@Param('id') id: string): Promise<Flashcard> {
    return this.flashcardsService.remove(id)
  }
}
