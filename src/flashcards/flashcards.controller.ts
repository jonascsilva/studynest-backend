import { Controller, Get, Param, Post, Delete, Patch, Body, UseGuards, Query } from '@nestjs/common'

import { JwtAuthGuard } from '$/auth/jwt-auth.guard'
import { AiService } from '$/flashcards/ai.service'
import { CreateFlashcardRevisionDto } from '$/flashcards/dtos/create-flashcard-revision.dto'
import { CreateFlashcardDto } from '$/flashcards/dtos/create-flashcard.dto'
import { FlashcardDto } from '$/flashcards/dtos/flashcard.dto'
import { UpdateFlashcardDto } from '$/flashcards/dtos/update-flashcard.dto'
import { Flashcard } from '$/flashcards/flashcard.entity'
import { FlashcardsService } from '$/flashcards/flashcards.service'
import { Serialize } from '$/interceptor/serialize.interceptor'
import { RequestUser, User } from '$/users/user.decorator'

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

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllFlashcards(
    @User() user: RequestUser,
    @Query('due') due?: string,
    @Query('upcoming') upcoming?: string
  ): Promise<Flashcard[]> {
    const userId = user.id

    if (due || upcoming) {
      const { dueFlashcards, upcomingFlashcards } =
        await this.flashcardsService.getFlashcardsWithReviews(userId)

      if (due && !upcoming) return dueFlashcards

      if (upcoming && !due) return upcomingFlashcards

      return [...dueFlashcards, ...upcomingFlashcards]
    }

    return this.flashcardsService.find(userId)
  }

  @Get('/ai')
  generateFlashcard(): Promise<Partial<Flashcard>> {
    return this.aiService.generate()
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
  review(
    @User() user: RequestUser,
    @Param('id') id: string,
    @Body() body: CreateFlashcardRevisionDto
  ): Promise<void> {
    return this.flashcardsService.reviewFlashcard(user.id, id, body.result)
  }
}
