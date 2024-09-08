import { Controller, Get } from '@nestjs/common'
import { User as UserModel, Note as NoteModel } from '@prisma/client'

import { AppService } from './app.service'
import { PrismaService } from './prisma.service'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prismaService: PrismaService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('users')
  async getAllUsers(): Promise<UserModel[]> {
    return this.prismaService.user.findMany()
  }

  @Get('notes')
  async getAllNotes(): Promise<NoteModel[]> {
    return this.prismaService.note.findMany()
  }
}
