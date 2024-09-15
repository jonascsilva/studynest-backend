import { AppModule } from '../app.module'
import { NestFactory } from '@nestjs/core'
import { Note } from '$/notes/note.entity'
import { Repository } from 'typeorm'
import { User } from '$/users/user.entity'
import { v7 as uuidv7 } from 'uuid'

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule)

  const userRepository = app.get<Repository<User>>('UserRepository')
  const noteRepository = app.get<Repository<Note>>('NoteRepository')

  const users = [
    {
      id: uuidv7(),
      name: 'Jonas',
      email: 'admin@example.com',
      password: '123456'
    },
    {
      id: uuidv7(),
      name: 'Alice',
      email: 'alice@example.com',
      password: 'password1'
    },
    {
      id: uuidv7(),
      name: 'Bob',
      email: 'bob@example.com',
      password: 'password2'
    }
  ]

  await userRepository.save(users)

  const notes = [
    {
      id: uuidv7(),
      title: 'Note 1',
      subject: 'Subject 1',
      content: 'Content of Note 1',
      userId: users[0].id
    },
    {
      id: uuidv7(),
      title: 'Note 2',
      subject: 'Subject 2',
      content: 'Content of Note 2',
      userId: users[1].id
    }
  ]

  await noteRepository.save(notes)

  console.log('Seeding complete!')

  await app.close()
}

bootstrap()
