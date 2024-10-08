import { NestFactory } from '@nestjs/core'
import { Repository } from 'typeorm'

import { AppModule } from '$/app.module'
import { Flashcard } from '$/flashcards/flashcard.entity'
import { Note } from '$/notes/note.entity'
import { CreateUserDto } from '$/users/dtos/create-user.dto'
import { User } from '$/users/user.entity'

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule)

  const userRepository = app.get<Repository<User>>('UserRepository')
  const noteRepository = app.get<Repository<Note>>('NoteRepository')
  const flashcardRepository = app.get<Repository<Flashcard>>('FlashcardRepository')

  const users: CreateUserDto[] = [
    {
      name: 'Jonas',
      email: 'admin@example.com',
      password: '123456'
    },
    {
      name: 'Alice',
      email: 'alice@example.com',
      password: 'password1'
    },
    {
      name: 'Bob',
      email: 'bob@example.com',
      password: 'password2'
    }
  ]

  const savedUsers = await userRepository.save(users)

  const notes = [
    {
      title: 'Revolução Francesa',
      subject: 'História',
      content:
        'A Revolução Francesa (1789-1799) foi um marco na história mundial, que resultou na queda da monarquia absolutista e na ascensão de valores republicanos, como liberdade, igualdade e fraternidade. Este movimento influenciou diversas revoluções pelo mundo e marcou o fim do Antigo Regime.',
      userId: savedUsers[0].id
    },
    {
      title: 'Revolução Industrial',
      subject: 'História',
      content:
        'A Revolução Industrial, iniciada na Inglaterra no século XVIII, foi um período de grandes inovações tecnológicas, como a máquina a vapor e o tear mecânico. Isso transformou a produção artesanal em manufatureira, impulsionando a urbanização e criando novas dinâmicas sociais e econômicas.',
      userId: savedUsers[1].id
    },
    {
      title: 'Guerra Fria',
      subject: 'História',
      content:
        'A Guerra Fria foi uma disputa geopolítica e ideológica entre os Estados Unidos (capitalismo) e a União Soviética (socialismo) de 1947 até 1991. O conflito foi caracterizado por corridas armamentistas e espaciais, além da formação de blocos militares como a OTAN e o Pacto de Varsóvia.',
      userId: savedUsers[0].id
    },
    {
      title: 'Teoria da Evolução',
      subject: 'Ciência',
      content:
        'Proposta por Charles Darwin em 1859, a Teoria da Evolução sugere que as espécies evoluem ao longo do tempo por meio da seleção natural. Os indivíduos com características mais adaptadas ao ambiente têm maiores chances de sobreviver e se reproduzir, transmitindo essas características para as próximas gerações.',
      userId: savedUsers[0].id
    },
    {
      title: 'Leis de Newton',
      subject: 'Física',
      content:
        'As Leis de Newton descrevem o movimento dos corpos. A primeira lei é a da inércia, a segunda é a da força resultante (F = ma) e a terceira afirma que toda ação tem uma reação de igual intensidade e em sentido contrário. Elas são fundamentais para entender a mecânica clássica.',
      userId: savedUsers[0].id
    }
  ]

  await noteRepository.save(notes)

  const flashcards = [
    {
      question: 'O que foi a Revolução Francesa?',
      subject: 'História',
      answer:
        'Um movimento social e político que ocorreu na França em 1789, resultando na queda da monarquia e no estabelecimento da República.',
      userId: savedUsers[0].id
    },
    {
      question: 'O que é a fotossíntese?',
      subject: 'Biologia',
      answer:
        'É o processo pelo qual as plantas, algas e algumas bactérias utilizam a luz solar para converter dióxido de carbono e água em glicose e oxigênio.',
      userId: savedUsers[1].id
    },
    {
      question: 'O que é o ciclo da água?',
      subject: 'Ciência',
      answer:
        'O ciclo da água é o processo contínuo de circulação da água na Terra, envolvendo evaporação, condensação, precipitação e infiltração.',
      userId: savedUsers[0].id
    }
  ]

  await flashcardRepository.save(flashcards)

  console.log('Seeding complete!')

  await app.close()
}

bootstrap()
