import { InjectRepository } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'
import { Note } from '$/notes/note.entity'
import { Repository } from 'typeorm'

@Injectable()
export class NotesService {
  constructor(@InjectRepository(Note) private repo: Repository<Note>) {}

  getAllNotes(): string {
    return 'Not implemented yet'
  }

  getNote(id: string): string {
    return 'Not implemented yet'
  }
}
