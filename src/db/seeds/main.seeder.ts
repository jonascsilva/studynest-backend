import * as argon2 from 'argon2'
import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'

import { flashcards as rawFlashcards } from '$/db/seeds/data/flashcard/flashcards.json'
import { notes as rawNotes } from '$/db/seeds/data/note/notes.json'
import { users as rawUsers } from '$/db/seeds/data/user/users.json'
import { Flashcard } from '$/flashcards/flashcard.entity'
import { Note } from '$/notes/note.entity'
import { User } from '$/users/user.entity'

export default class UserSeeder implements Seeder {
  async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    await this.cleanTables(dataSource)

    const usersInsertResult = await this.insertUsersData(dataSource)

    const usersIds = usersInsertResult.identifiers.map(identifier => identifier.id)

    await this.insertFlashcardsData(dataSource, usersIds)

    await this.insertNotesData(dataSource, usersIds)

    await this.insertFactoriesData(factoryManager)
  }

  async cleanTables(dataSource: DataSource) {
    await dataSource.query('TRUNCATE "user" RESTART IDENTITY CASCADE;')
    await dataSource.query('TRUNCATE "flashcard" RESTART IDENTITY CASCADE;')
    await dataSource.query('TRUNCATE "note" RESTART IDENTITY CASCADE;')
  }

  async insertFactoriesData(factoryManager: SeederFactoryManager) {
    const userFactory = factoryManager.get(User)

    await userFactory.saveMany(5)

    const noteFactory = factoryManager.get(Note)

    await noteFactory.saveMany(5)

    const flashcardFactory = factoryManager.get(Flashcard)

    await flashcardFactory.saveMany(5)
  }

  getRandomEntry(array: string[]): string {
    const randomIndex = Math.floor(Math.random() * array.length)
    const randomEntry = array[randomIndex]

    return randomEntry
  }

  async insertUsersData(dataSource: DataSource) {
    const repository = dataSource.getRepository(User)

    const usersToInsert = await Promise.all(
      rawUsers.map(async rawUser => ({
        ...rawUser,
        password: await argon2.hash(rawUser.password)
      }))
    )

    return repository.insert(usersToInsert)
  }

  async insertFlashcardsData(dataSource: DataSource, usersIds: string[]) {
    const repository = dataSource.getRepository(Flashcard)

    const flashcardsToInsert = await Promise.all(
      rawFlashcards.map(async rawFlashcard => ({
        ...rawFlashcard,
        userId: this.getRandomEntry(usersIds)
      }))
    )

    await repository.insert(flashcardsToInsert)
  }

  async insertNotesData(dataSource: DataSource, usersIds: string[]) {
    const repository = dataSource.getRepository(Note)

    const notesToInsert = await Promise.all(
      rawNotes.map(async rawNotes => ({
        ...rawNotes,
        userId: this.getRandomEntry(usersIds)
      }))
    )

    await repository.insert(notesToInsert)
  }
}
