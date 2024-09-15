import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Note } from '$/notes/note.entity'

@Injectable()
export class NotesService {
  constructor(@InjectRepository(Note) private repo: Repository<Note>) {}

  getAllNotes(): Promise<Note[]> {
    return this.repo.find()
  }

  getNote(id: string): Promise<Note> {
    return this.repo.findOneBy({ id })
  }
}
