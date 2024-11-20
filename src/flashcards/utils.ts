import { FlashcardRevision } from '$/flashcards/flashcard-revision.entity'

function calculateCurrentIntervalLevel(
  revisions: FlashcardRevision[],
  intervalsQuantity: number
): number {
  let level = 1

  for (const revision of revisions) {
    if (revision.result) {
      level = Math.min(level + 1, intervalsQuantity)
    } else {
      level = Math.max(level - 1, 1)
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
