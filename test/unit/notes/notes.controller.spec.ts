import { Test, TestingModule } from '@nestjs/testing'
import { NotesController } from '$/notes/notes.controller'
import { NotesService } from '$/notes/notes.service'
import { PrismaService } from '$/prisma.service'

describe('NotesController', () => {
  let controller: NotesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [NotesService, PrismaService]
    }).compile()

    controller = module.get<NotesController>(NotesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
