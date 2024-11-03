import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateNoteDto } from '$/notes/dtos/create-note.dto'
import { UpdateNoteDto } from '$/notes/dtos/update-note.dto'
import { Note } from '$/notes/note.entity'

@Injectable()
export class NotesService {
  constructor(@InjectRepository(Note) private readonly noteRepo: Repository<Note>) {}

  async find(): Promise<Note[]> {
    return this.noteRepo.find()
  }

  async findOne(id: string): Promise<Note> {
    const note = await this.noteRepo.findOneBy({ id })

    if (!note) {
      throw new NotFoundException('Note not found')
    }

    return note
  }

  async create(attrs: CreateNoteDto): Promise<Note> {
    const note = this.noteRepo.create(attrs)

    return this.noteRepo.save(note)
  }

  async update(id: string, attrs: UpdateNoteDto): Promise<Note> {
    const note = await this.findOne(id)

    Object.assign(note, attrs)

    return this.noteRepo.save(note)
  }

  async remove(id: string): Promise<Note> {
    const note = await this.findOne(id)

    return this.noteRepo.remove(note)
  }
}
