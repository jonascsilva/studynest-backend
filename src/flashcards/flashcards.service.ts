import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { FlashcardRevision } from '$/flashcards/flashcard-revision.entity'
import { Flashcard } from '$/flashcards/flashcard.entity'
import { calculateCurrentIntervalLevel, calculateNextReviewDate } from '$/flashcards/utils'
import { UserSettings } from '$/users/user-settings.entity'

export type FlashcardWithReview = Flashcard & { currentLevel: number; nextReviewDate: Date }

@Injectable()
export class FlashcardsService {
  constructor(
    @InjectRepository(Flashcard) private readonly flashcardRepo: Repository<Flashcard>,
    @InjectRepository(FlashcardRevision)
    private readonly flashcardRevisionRepo: Repository<FlashcardRevision>,
    @InjectRepository(UserSettings)
    private readonly userSettingsRepo: Repository<UserSettings>
  ) {}

  async create(userId: string, attrs: Partial<Flashcard>): Promise<Flashcard> {
    attrs.userId = userId

    const flashcard = this.flashcardRepo.create(attrs)

    const createdFlashcard = await this.flashcardRepo.save(flashcard)

    return createdFlashcard
  }

  async findOne(userId: string, id: string): Promise<Flashcard> {
    const foundFlashcard = await this.flashcardRepo.findOneBy({ userId, id })

    if (!foundFlashcard) {
      throw new NotFoundException('Flashcard not found')
    }

    return foundFlashcard
  }

  async find(userId: string): Promise<Flashcard[]> {
    const foundFlashcards = await this.flashcardRepo.findBy({ userId })

    return foundFlashcards
  }

  async update(userId: string, id: string, attrs: Partial<Flashcard>): Promise<Flashcard> {
    const flashcard = await this.findOne(userId, id)

    Object.assign(flashcard, attrs)

    const updatedFlashcard = await this.flashcardRepo.save(flashcard)

    return updatedFlashcard
  }

  async remove(userId: string, id: string): Promise<Flashcard> {
    const flashcard = await this.findOne(userId, id)

    const result = await this.flashcardRepo.remove(flashcard)

    const removedFlashcard = { ...result, id }

    return removedFlashcard
  }

  async reviewFlashcard(userId: string, id: string, result: number): Promise<void> {
    await this.findOne(userId, id)

    const attrs = {
      flashcardId: id,
      result
    }

    const flashcardRevision = this.flashcardRevisionRepo.create(attrs)

    await this.flashcardRevisionRepo.save(flashcardRevision)
  }

  async getFlashcardsWithReviews(
    userId: string
  ): Promise<{ dueFlashcards: FlashcardWithReview[]; upcomingFlashcards: FlashcardWithReview[] }> {
    const now = new Date()

    const flashcards = await this.flashcardRepo.find({
      where: { userId }
    })

    const dueFlashcards: FlashcardWithReview[] = []
    const upcomingFlashcards: FlashcardWithReview[] = []

    for (const flashcard of flashcards) {
      const revisions = await this.flashcardRevisionRepo.find({
        where: { flashcardId: flashcard.id },
        order: { createdAt: 'ASC' }
      })

      if (revisions.length === 0) {
        const nextReviewDate = new Date(now)

        nextReviewDate.setHours(nextReviewDate.getHours() - 24)

        const flashcardToReview = { ...flashcard, currentLevel: 1, nextReviewDate }

        dueFlashcards.push(flashcardToReview)

        continue
      }

      const userSettings = await this.userSettingsRepo.findOne({
        where: { userId }
      })

      const currentLevel = calculateCurrentIntervalLevel(revisions, userSettings.intervalsQuantity)

      const lastRevisionDate = revisions[revisions.length - 1].createdAt

      const nextReviewDate = calculateNextReviewDate(
        userSettings.baseInterval,
        userSettings.intervalIncreaseRate,
        currentLevel,
        lastRevisionDate
      )

      const flashcardToReview = { ...flashcard, currentLevel, nextReviewDate }

      if (nextReviewDate <= now) {
        dueFlashcards.push(flashcardToReview)
      } else {
        upcomingFlashcards.push(flashcardToReview)
      }
    }

    return { dueFlashcards, upcomingFlashcards }
  }
}
