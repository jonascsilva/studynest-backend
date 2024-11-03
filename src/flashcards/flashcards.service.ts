import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { FlashcardRevision } from '$/flashcards/flashcard-revision.entity'
import { Flashcard } from '$/flashcards/flashcard.entity'
import { calculateCurrentIntervalLevel, calculateNextReviewDate } from '$/flashcards/utils'
import { UserSettings } from '$/users/user-settings.entity'

type DueFlashcard = Flashcard & { currentLevel?: number; nextReviewDate?: Date }

@Injectable()
export class FlashcardsService {
  constructor(
    @InjectRepository(Flashcard) private readonly flashcardRepo: Repository<Flashcard>,
    @InjectRepository(FlashcardRevision)
    private readonly flashcardRevisionRepo: Repository<FlashcardRevision>,
    @InjectRepository(UserSettings)
    private readonly userSettingsRepo: Repository<UserSettings>
  ) {}

  create(attrs: Partial<Flashcard>): Promise<Flashcard> {
    const flashcard = this.flashcardRepo.create(attrs)

    return this.flashcardRepo.save(flashcard)
  }

  async findOne(id: string): Promise<Flashcard> {
    const flashcard = await this.flashcardRepo.findOneBy({ id })

    if (!flashcard) {
      throw new NotFoundException('Flashcard not found')
    }

    return flashcard
  }

  find(): Promise<Flashcard[]> {
    return this.flashcardRepo.find()
  }

  async update(id: string, attrs: Partial<Flashcard>): Promise<Flashcard> {
    const flashcard = await this.findOne(id)

    Object.assign(flashcard, attrs)

    return this.flashcardRepo.save(flashcard)
  }

  async remove(id: string): Promise<Flashcard> {
    const flashcard = await this.findOne(id)

    return this.flashcardRepo.remove(flashcard)
  }

  async reviewFlashcard(userId: string, flashcardId: string, result: number): Promise<void> {
    const flashcard = await this.flashcardRepo.findOne({
      where: { id: flashcardId, userId }
    })

    if (!flashcard) {
      throw new Error('Flashcard not found or does not belong to the user')
    }

    const newRevision = new FlashcardRevision()

    newRevision.flashcardId = flashcardId
    newRevision.result = result

    await this.flashcardRevisionRepo.save(newRevision)
  }

  async getDueFlashcards(userId: string): Promise<Flashcard[]> {
    const now = new Date()

    const flashcards = await this.flashcardRepo.find({
      where: { userId }
    })

    const dueFlashcards: DueFlashcard[] = []

    for (const flashcard of flashcards) {
      const revisions = await this.flashcardRevisionRepo.find({
        where: { flashcardId: flashcard.id },
        order: { createdAt: 'ASC' }
      })

      if (revisions.length === 0) {
        dueFlashcards.push(flashcard)

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
      }
    }

    return dueFlashcards
  }
}
