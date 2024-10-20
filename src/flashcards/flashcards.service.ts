import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Flashcard } from '$/flashcards/flashcard.entity'

@Injectable()
export class FlashcardsService {
  constructor(@InjectRepository(Flashcard) private readonly repo: Repository<Flashcard>) {}

  create(attrs: Partial<Flashcard>): Promise<Flashcard> {
    const flashcard = this.repo.create(attrs)

    return this.repo.save(flashcard)
  }

  findOne(id: string): Promise<Flashcard> {
    return this.repo.findOneBy({ id })
  }

  find(): Promise<Flashcard[]> {
    return this.repo.find()
  }

  async update(id: string, attrs: Partial<Flashcard>): Promise<Flashcard> {
    const flashcard = await this.findOne(id)

    if (!flashcard) {
      throw new NotFoundException('Flashcard not found')
    }

    Object.assign(flashcard, attrs)

    return this.repo.save(flashcard)
  }

  async remove(id: string): Promise<Flashcard> {
    const flashcard = await this.findOne(id)

    if (!flashcard) {
      throw new NotFoundException('Flashcard not found')
    }

    return this.repo.remove(flashcard)
  }
}
