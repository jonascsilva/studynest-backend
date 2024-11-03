import { FlashcardRevision } from '$/flashcards/flashcard-revision.entity'

function calculateCurrentIntervalLevel(
  revisions: FlashcardRevision[],
  intervalsQuantity: number
): number {
  let level = 1

  for (const revision of revisions) {
    switch (revision.result) {
      case 1:
        level = Math.min(level + 1, intervalsQuantity)

        break
      default:
        level = Math.max(level - 1, 1)

        break
    }
  }

  return level
}

function calculateNextReviewDate(
  baseInterval: number,
  intervalIncreaseRate: number,
  level: number,
  lastRevisionDate: Date
): Date {
  const daysToAdd = baseInterval * Math.pow(intervalIncreaseRate, level - 1)
  const nextReview = new Date(lastRevisionDate)

  nextReview.setDate(nextReview.getDate() + daysToAdd)

  return nextReview
}

export { calculateCurrentIntervalLevel, calculateNextReviewDate }
