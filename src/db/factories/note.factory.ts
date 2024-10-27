import { setSeederFactory } from 'typeorm-extension'

import { Note } from '$/notes/note.entity'

export default setSeederFactory(Note, faker => {
  const note = new Note()

  note.title = faker.word.words(4)
  note.subject = faker.word.words()
  note.content = faker.word.words(10)
  note.userId = 'd1c23c75-0930-4329-8c5b-600c46ee5f3c'

  return note
})
