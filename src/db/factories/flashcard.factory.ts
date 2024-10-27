import { setSeederFactory } from 'typeorm-extension'

import { Flashcard } from '$/flashcards/flashcard.entity'

export default setSeederFactory(Flashcard, faker => {
  const flashcard = new Flashcard()

  flashcard.question = faker.word.words(4)
  flashcard.subject = faker.word.words()
  flashcard.answer = faker.word.words(10)
  flashcard.userId = 'd1c23c75-0930-4329-8c5b-600c46ee5f3c'

  return flashcard
})
