import { Test, TestingModule } from '@nestjs/testing'
import { NotesService } from 'src/notes/notes.service'

describe('NotesService', () => {
  let service: NotesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotesService]
    }).compile()

    service = module.get<NotesService>(NotesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
