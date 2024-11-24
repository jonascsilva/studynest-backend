import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { FlashcardRevision } from '$/flashcards/flashcard-revision.entity'
import { Flashcard } from '$/flashcards/flashcard.entity'
import { calculateCurrentIntervalLevel, calculateNextReviewDate } from '$/flashcards/utils'
import { UserSettings } from '$/settings/user-settings.entity'

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
    const foundFlashcards = await this.flashcardRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    })

    return foundFlashcards
  }

  async findShared(userId: string, query?: string): Promise<Flashcard[]> {
    const qb = this.flashcardRepo
      .createQueryBuilder('flashcard')
      .where('flashcard.shared = :shared', { shared: true })
      .andWhere('flashcard.userId != :userId', { userId })
      .orderBy('flashcard.createdAt', 'DESC')

    if (query) {
      const lowerQuery = `%${query.toLowerCase()}%`

      qb.andWhere(
        '(LOWER(flashcard.question) LIKE :query OR LOWER(flashcard.subject) LIKE :query)',
        { query: lowerQuery }
      )
    }

    const foundFlashcards = await qb.getMany()

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

  async reviewFlashcard(
    userId: string,
    flashcardId: string,
    result: number
  ): Promise<FlashcardWithReview> {
    const flashcard = await this.findOne(userId, flashcardId)

    const attrs = {
      flashcardId,
      result
    }

    const flashcardRevision = this.flashcardRevisionRepo.create(attrs)

    await this.flashcardRevisionRepo.save(flashcardRevision)

    const flashcardWithReview = this.getFlashcardWithReview(userId, flashcard)

    return flashcardWithReview
  }

  async getFlashcardWithReview(userId: string, flashcard: Flashcard): Promise<FlashcardWithReview> {
    const revisions = await this.flashcardRevisionRepo.find({
      where: { flashcardId: flashcard.id },
      order: { createdAt: 'DESC' }
    })

    if (revisions.length === 0) {
      const nextReviewDate = new Date()

      nextReviewDate.setHours(nextReviewDate.getHours() - 24)

      const flashcardWithReview = { ...flashcard, currentLevel: 1, nextReviewDate }

      return flashcardWithReview
    }

    const userSettings = await this.userSettingsRepo.findOneBy({ userId })

    const currentLevel = calculateCurrentIntervalLevel(revisions, userSettings.intervalsQuantity)

    const lastRevisionDate = revisions[revisions.length - 1].createdAt

    const nextReviewDate = calculateNextReviewDate(
      userSettings.baseInterval,
      userSettings.intervalIncreaseRate,
      currentLevel,
      lastRevisionDate
    )

    const flashcardWithReview = { ...flashcard, currentLevel, nextReviewDate }

    return flashcardWithReview
  }

  async getFlashcardsWithReviews(
    userId: string
  ): Promise<{ dueFlashcards: FlashcardWithReview[]; upcomingFlashcards: FlashcardWithReview[] }> {
    const now = new Date()

    const flashcards = await this.flashcardRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    })

    const dueFlashcards: FlashcardWithReview[] = []
    const upcomingFlashcards: FlashcardWithReview[] = []

    for (const flashcard of flashcards) {
      const flashcardWithReview = await this.getFlashcardWithReview(userId, flashcard)

      if (flashcardWithReview.nextReviewDate <= now) {
        dueFlashcards.push(flashcardWithReview)
      } else {
        upcomingFlashcards.push(flashcardWithReview)
      }
    }

    return { dueFlashcards, upcomingFlashcards }
  }
}
