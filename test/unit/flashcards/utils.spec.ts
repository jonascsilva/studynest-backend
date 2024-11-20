import { FlashcardRevision } from '$/flashcards/flashcard-revision.entity'
import { calculateCurrentIntervalLevel, calculateNextReviewDate } from '$/flashcards/utils'

describe('Flashcard Utils', () => {
  describe('calculateCurrentIntervalLevel', () => {
    it('should return level 1 when there are no revisions', () => {
      const revisions: FlashcardRevision[] = []
      const intervalsQuantity = 5

      const level = calculateCurrentIntervalLevel(revisions, intervalsQuantity)

      expect(level).toBe(1)
    })

    it('should increase level by 1 for each correct revision (result === 1)', () => {
      const revisions: FlashcardRevision[] = [
        { result: 1 } as FlashcardRevision,
        { result: 1 } as FlashcardRevision,
        { result: 1 } as FlashcardRevision
      ]
      const intervalsQuantity = 5

      const level = calculateCurrentIntervalLevel(revisions, intervalsQuantity)

      expect(level).toBe(4)
    })

    it('should not exceed intervalsQuantity when increasing level', () => {
      const revisions: FlashcardRevision[] = [
        { result: 1 } as FlashcardRevision,
        { result: 1 } as FlashcardRevision,
        { result: 1 } as FlashcardRevision,
        { result: 1 } as FlashcardRevision,
        { result: 1 } as FlashcardRevision
      ]
      const intervalsQuantity = 3

      const level = calculateCurrentIntervalLevel(revisions, intervalsQuantity)

      expect(level).toBe(3)
    })

    it('should decrease level by 1 for each incorrect revision (result !== 1)', () => {
      const revisions: FlashcardRevision[] = [
        { result: 1 } as FlashcardRevision,
        { result: 0 } as FlashcardRevision,
        { result: 0 } as FlashcardRevision
      ]
      const intervalsQuantity = 5

      const level = calculateCurrentIntervalLevel(revisions, intervalsQuantity)

      expect(level).toBe(1)
    })

    it('should not go below level 1 when decreasing level', () => {
      const revisions: FlashcardRevision[] = [
        { result: 0 } as FlashcardRevision,
        { result: 0 } as FlashcardRevision,
        { result: 0 } as FlashcardRevision
      ]
      const intervalsQuantity = 5

      const level = calculateCurrentIntervalLevel(revisions, intervalsQuantity)

      expect(level).toBe(1)
    })

    it('should handle mixed revision results correctly', () => {
      const revisions: FlashcardRevision[] = [
        { result: 1 } as FlashcardRevision,
        { result: 0 } as FlashcardRevision,
        { result: 1 } as FlashcardRevision,
        { result: 1 } as FlashcardRevision,
        { result: 0 } as FlashcardRevision
      ]
      const intervalsQuantity = 5

      const level = calculateCurrentIntervalLevel(revisions, intervalsQuantity)

      expect(level).toBe(2)
    })
  })

  describe('calculateNextReviewDate', () => {
    it('should calculate the next review date correctly with level 1', () => {
      const baseInterval = 1
      const intervalIncreaseRate = 2
      const level = 1
      const lastRevisionDate = new Date('2023-01-01')

      const expectedDate = new Date('2023-01-02')

      const nextReviewDate = calculateNextReviewDate(
        baseInterval,
        intervalIncreaseRate,
        level,
        lastRevisionDate
      )

      expect(nextReviewDate.toDateString()).toBe(expectedDate.toDateString())
    })

    it('should calculate the next review date correctly with higher levels', () => {
      const baseInterval = 1
      const intervalIncreaseRate = 2
      const level = 3
      const lastRevisionDate = new Date('2023-01-01')

      const daysToAdd = baseInterval * Math.pow(intervalIncreaseRate, level - 1)

      expect(daysToAdd).toBe(4)

      const expectedDate = new Date('2023-01-05')

      const nextReviewDate = calculateNextReviewDate(
        baseInterval,
        intervalIncreaseRate,
        level,
        lastRevisionDate
      )

      expect(nextReviewDate.toDateString()).toBe(expectedDate.toDateString())
    })

    it('should handle different base intervals and increase rates', () => {
      const baseInterval = 2
      const intervalIncreaseRate = 3
      const level = 2
      const lastRevisionDate = new Date('2023-01-01')

      const daysToAdd = baseInterval * Math.pow(intervalIncreaseRate, level - 1)

      expect(daysToAdd).toBe(6)

      const expectedDate = new Date('2023-01-07')

      const nextReviewDate = calculateNextReviewDate(
        baseInterval,
        intervalIncreaseRate,
        level,
        lastRevisionDate
      )

      expect(nextReviewDate.toDateString()).toBe(expectedDate.toDateString())
    })

    it('should handle fractional days to add', () => {
      const baseInterval = 1.5
      const intervalIncreaseRate = 2
      const level = 2
      const lastRevisionDate = new Date('2023-01-01')

      const daysToAdd = baseInterval * Math.pow(intervalIncreaseRate, level - 1)

      expect(daysToAdd).toBe(3)

      const expectedDate = new Date('2023-01-04')

      const nextReviewDate = calculateNextReviewDate(
        baseInterval,
        intervalIncreaseRate,
        level,
        lastRevisionDate
      )

      expect(nextReviewDate.toDateString()).toBe(expectedDate.toDateString())
    })

    it('should handle zero base interval', () => {
      const baseInterval = 0
      const intervalIncreaseRate = 2
      const level = 3
      const lastRevisionDate = new Date('2023-01-01')

      const expectedDate = new Date('2023-01-01')

      const nextReviewDate = calculateNextReviewDate(
        baseInterval,
        intervalIncreaseRate,
        level,
        lastRevisionDate
      )

      expect(nextReviewDate.toDateString()).toBe(expectedDate.toDateString())
    })

    it('should handle zero interval increase rate', () => {
      const baseInterval = 1
      const intervalIncreaseRate = 0
      const level = 3
      const lastRevisionDate = new Date('2023-01-01')

      const daysToAdd = baseInterval * Math.pow(intervalIncreaseRate, level - 1)

      expect(daysToAdd).toBe(0)

      const expectedDate = new Date('2023-01-01')

      const nextReviewDate = calculateNextReviewDate(
        baseInterval,
        intervalIncreaseRate,
        level,
        lastRevisionDate
      )

      expect(nextReviewDate.toDateString()).toBe(expectedDate.toDateString())
    })

    it('should handle negative base interval and increase rate', () => {
      const baseInterval = -1
      const intervalIncreaseRate = -2
      const level = 2
      const lastRevisionDate = new Date('2023-01-10')

      const daysToAdd = baseInterval * Math.pow(intervalIncreaseRate, level - 1)

      expect(daysToAdd).toBe(2)

      const expectedDate = new Date('2023-01-12')

      const nextReviewDate = calculateNextReviewDate(
        baseInterval,
        intervalIncreaseRate,
        level,
        lastRevisionDate
      )

      expect(nextReviewDate.toDateString()).toBe(expectedDate.toDateString())
    })
  })
})
