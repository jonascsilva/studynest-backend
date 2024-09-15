import { InjectRepository } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'
import { Note } from '$/notes/note.entity'
import { Repository } from 'typeorm'

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
