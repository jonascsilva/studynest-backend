import { v7 as uuid } from 'uuid'

import { Flashcard } from '$/flashcards/flashcard.entity'
import { FlashcardWithReview } from '$/flashcards/flashcards.service'

const now = new Date()

const dueReviewDate = new Date(now)

dueReviewDate.setHours(dueReviewDate.getHours() - 24)

const upcomingReviewDate = new Date(now)

upcomingReviewDate.setHours(upcomingReviewDate.getHours() + 48)

const flashcardsMock: Flashcard[] = [
  {
    id: uuid(),
    question: 'O que é o eon Fanerozoico?',
    subject: 'Geologia',
    answer: 'O eon Fanerozoico é o eon atual.',
    userId: 'fake-user-id',
    shared: false,
    createdAt: dueReviewDate,
    updatedAt: dueReviewDate,
    user: null,
    flashcardRevisions: null
  },
  {
    id: uuid(),
    question: 'O que é o manto terrestre?',
    subject: 'Geologia',
    answer: 'O manto terrestre é a camada entre a crosta e o núcleo',
    userId: 'fake-user-id',
    shared: false,
    createdAt: dueReviewDate,
    updatedAt: dueReviewDate,
    user: null,
    flashcardRevisions: null
  },
  {
    id: uuid(),
    question: 'Quando o alfabeto fonético da OTAN foi adotado?',
    subject: 'Alfabeto Fonético',
    answer: 'O alfabeto fonético da OTAN foi adotado em 1956',
    userId: 'fake-user-id',
    shared: false,
    createdAt: dueReviewDate,
    updatedAt: dueReviewDate,
    user: null,
    flashcardRevisions: null
  }
]

const dueFlashcardsMock: FlashcardWithReview[] = [
  {
    ...flashcardsMock[0],
    currentLevel: 1,
    nextReviewDate: dueReviewDate
  },
  {
    ...flashcardsMock[1],
    currentLevel: 2,
    nextReviewDate: dueReviewDate
  }
]

const upcomingFlashcardsMock: FlashcardWithReview[] = [
  {
    ...flashcardsMock[2],
    currentLevel: 3,
    nextReviewDate: upcomingReviewDate
  }
]

export { flashcardsMock, dueFlashcardsMock, upcomingFlashcardsMock }
