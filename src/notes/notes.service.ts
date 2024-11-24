import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UpdateNoteDto } from '$/notes/dtos/update-note.dto'
import { Note } from '$/notes/note.entity'

@Injectable()
export class NotesService {
  constructor(@InjectRepository(Note) private readonly noteRepo: Repository<Note>) {}

  async find(userId: string): Promise<Note[]> {
    const foundNotes = await this.noteRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    })

    return foundNotes
  }

  async findShared(userId: string, query?: string): Promise<Note[]> {
    const qb = this.noteRepo
      .createQueryBuilder('note')
      .where('note.shared = :shared', { shared: true })
      .andWhere('note.userId != :userId', { userId })
      .orderBy('note.createdAt', 'DESC')

    if (query) {
      const lowerQuery = `%${query.toLowerCase()}%`

      qb.andWhere('(LOWER(note.title) LIKE :query OR LOWER(note.subject) LIKE :query)', {
        query: lowerQuery
      })
    }

    const foundNotes = await qb.getMany()

    return foundNotes
  }

  async findOne(userId: string, id: string): Promise<Note> {
    const foundNote = await this.noteRepo.findOneBy({ userId, id })

    if (!foundNote) {
      throw new NotFoundException('Note not found')
    }

    return foundNote
  }

  async create(userId: string, attrs: Partial<Note>): Promise<Note> {
    attrs.userId = userId

    const note = this.noteRepo.create(attrs)

    const createdNote = await this.noteRepo.save(note)

    return createdNote
  }

  async update(userId: string, id: string, attrs: UpdateNoteDto): Promise<Note> {
    const note = await this.findOne(userId, id)

    Object.assign(note, attrs)

    const updatedNote = await this.noteRepo.save(note)

    return updatedNote
  }

  async remove(userId: string, id: string): Promise<Note> {
    const note = await this.findOne(userId, id)

    const result = await this.noteRepo.remove(note)

    const removedNote = { ...result, id }

    return removedNote
  }
}
