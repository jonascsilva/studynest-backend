import { Controller, Get, Param, Post, Delete, Patch, Body, Query } from '@nestjs/common'

import { Authenticated } from '$/auth/auth.decorator'
import { AiService } from '$/flashcards/ai.service'
import { CreateFlashcardRevisionDto } from '$/flashcards/dtos/create-flashcard-revision.dto'
import { CreateFlashcardDto } from '$/flashcards/dtos/create-flashcard.dto'
import { FlashcardDto } from '$/flashcards/dtos/flashcard.dto'
import { GenerateFlashcardContentDto } from '$/flashcards/dtos/generate-flashcard-content.dto'
import { UpdateFlashcardDto } from '$/flashcards/dtos/update-flashcard.dto'
import { Flashcard } from '$/flashcards/flashcard.entity'
import { FlashcardsService, FlashcardWithReview } from '$/flashcards/flashcards.service'
import { Serialize } from '$/interceptor/serialize.interceptor'
import { RequestUser, ReqUser } from '$/users/user.decorator'

@Controller('flashcards')
@Serialize(FlashcardDto)
@Authenticated()
export class FlashcardsController {
  constructor(
    private readonly flashcardsService: FlashcardsService,
    private readonly aiService: AiService
  ) {}

  @Post()
  createFlashcard(
    @ReqUser() user: RequestUser,
    @Body() body: CreateFlashcardDto
  ): Promise<Flashcard> {
    return this.flashcardsService.create(user.id, body)
  }

  @Get()
  async getAllFlashcards(
    @ReqUser() user: RequestUser,
    @Query('shared') shared?: boolean,
    @Query('query') query?: string,
    @Query('due') due?: boolean,
    @Query('upcoming') upcoming?: boolean
  ): Promise<Flashcard[]> {
    const userId = user.id

    if (shared) {
      return this.flashcardsService.findShared(userId, query)
    }

    if (due || upcoming) {
      const { dueFlashcards, upcomingFlashcards } =
        await this.flashcardsService.getFlashcardsWithReviews(userId)

      if (due && !upcoming) return dueFlashcards

      if (upcoming && !due) return upcomingFlashcards

      return [...dueFlashcards, ...upcomingFlashcards]
    }

    return this.flashcardsService.find(userId)
  }

  @Post('/generate')
  generateFlashcard(@Body() body: GenerateFlashcardContentDto): Promise<Partial<Flashcard>> {
    return this.aiService.generateContent(body.subject, body.question)
  }

  @Get('/from/:id')
  generateFlashcards(@ReqUser() user: RequestUser, @Param('id') id: string): Promise<Flashcard[]> {
    return this.aiService.generateFlashcards(user.id, id)
  }

  @Get('/:id')
  async findFlashcard(@ReqUser() user: RequestUser, @Param('id') id: string): Promise<Flashcard> {
    return this.flashcardsService.findOne(user.id, id)
  }

  @Patch('/:id')
  updateFlashcard(
    @ReqUser() user: RequestUser,
    @Param('id') id: string,
    @Body() body: UpdateFlashcardDto
  ): Promise<Flashcard> {
    return this.flashcardsService.update(user.id, id, body)
  }

  @Delete('/:id')
  removeFlashcard(@ReqUser() user: RequestUser, @Param('id') id: string): Promise<Flashcard> {
    return this.flashcardsService.remove(user.id, id)
  }

  @Post('/review/:id')
  review(
    @ReqUser() user: RequestUser,
    @Param('id') id: string,
    @Body() body: CreateFlashcardRevisionDto
  ): Promise<FlashcardWithReview> {
    return this.flashcardsService.reviewFlashcard(user.id, id, body.result)
  }
}
