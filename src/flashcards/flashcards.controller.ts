import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  Body,
  UseGuards,
  Request
} from '@nestjs/common'

import { JwtAuthGuard } from '$/auth/jwt-auth.guard'
import { AiService } from '$/flashcards/ai.service'
import { CreateFlashcardRevisionDto } from '$/flashcards/dtos/create-flashcard-revision.dto'
import { CreateFlashcardDto } from '$/flashcards/dtos/create-flashcard.dto'
import { FlashcardDto } from '$/flashcards/dtos/flashcard.dto'
import { UpdateFlashcardDto } from '$/flashcards/dtos/update-flashcard.dto'
import { Flashcard } from '$/flashcards/flashcard.entity'
import { FlashcardsService } from '$/flashcards/flashcards.service'
import { Serialize } from '$/interceptor/serialize.interceptor'
import { User } from '$/users/user.entity'

@Controller('flashcards')
@Serialize(FlashcardDto)
export class FlashcardsController {
  constructor(
    private readonly flashcardsService: FlashcardsService,
    private readonly aiService: AiService
  ) {}

  @Post()
  createFlashcard(@Body() body: CreateFlashcardDto): Promise<Flashcard> {
    return this.flashcardsService.create(body)
  }

  @Get()
  getAllFlashcards(): Promise<Flashcard[]> {
    return this.flashcardsService.find()
  }

  @Get('/ai')
  generateFlashcard(): Promise<Partial<Flashcard>> {
    return this.aiService.generate()
  }

  @UseGuards(JwtAuthGuard)
  @Get('/due')
  getDueFlashcards(@Request() req: { user: User }): Promise<Flashcard[]> {
    return this.flashcardsService.getDueFlashcards(req.user.id)
  }

  @Get('/:id')
  async findFlashcard(@Param('id') id: string): Promise<Flashcard> {
    return this.flashcardsService.findOne(id)
  }

  @Patch('/:id')
  updateFlashcard(@Param('id') id: string, @Body() body: UpdateFlashcardDto): Promise<Flashcard> {
    return this.flashcardsService.update(id, body)
  }

  @Delete('/:id')
  removeFlashcard(@Param('id') id: string): Promise<Flashcard> {
    return this.flashcardsService.remove(id)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/review/:id')
  review(@Request() req: { user: User }, @Body() body: CreateFlashcardRevisionDto): Promise<void> {
    return this.flashcardsService.reviewFlashcard(req.user.id, body.flashcardId, body.result)
  }
}
