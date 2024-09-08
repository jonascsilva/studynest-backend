import { Test, TestingModule } from '@nestjs/testing'
import { NotesService } from '$/notes/notes.service'
import { PrismaService } from '$/prisma.service'

describe('NotesService', () => {
  let service: NotesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotesService, PrismaService]
    }).compile()

    service = module.get<NotesService>(NotesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
