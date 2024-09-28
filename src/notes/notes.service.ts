import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Note } from '$/notes/note.entity'

@Injectable()
export class NotesService {
  constructor(@InjectRepository(Note) private repo: Repository<Note>) {}

  create(attrs: Partial<Note>): Promise<Note> {
    console.log(attrs)

    const note = this.repo.create(attrs)

    return this.repo.save(note)
  }

  findOne(id: string): Promise<Note> {
    return this.repo.findOneBy({ id })
  }

  find(): Promise<Note[]> {
    return this.repo.find()
  }

  async update(id: string, attrs: Partial<Note>): Promise<Note> {
    const note = await this.findOne(id)

    if (!note) {
      throw new NotFoundException('Note not found')
    }

    Object.assign(note, attrs)

    return this.repo.save(note)
  }

  async remove(id: string): Promise<Note> {
    const note = await this.findOne(id)

    if (!note) {
      throw new NotFoundException('Note not found')
    }

    return this.repo.remove(note)
  }
}
