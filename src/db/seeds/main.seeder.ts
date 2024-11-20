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

    const usersSaveResult = await this.saveUsersData(dataSource)

    const usersIds = usersSaveResult.map(user => user.id)

    await this.saveFlashcardsData(dataSource, usersIds)

    await this.saveNotesData(dataSource, usersIds)

    await this.saveFactoriesData(factoryManager)
  }

  async cleanTables(dataSource: DataSource) {
    await dataSource.query('TRUNCATE "flashcard" RESTART IDENTITY CASCADE;')
    await dataSource.query('TRUNCATE "flashcard_revision" RESTART IDENTITY CASCADE;')
    await dataSource.query('TRUNCATE "note" RESTART IDENTITY CASCADE;')
    await dataSource.query('TRUNCATE "user" RESTART IDENTITY CASCADE;')
    await dataSource.query('TRUNCATE "user_settings" RESTART IDENTITY CASCADE;')
  }

  async saveFactoriesData(factoryManager: SeederFactoryManager) {
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

  async saveUsersData(dataSource: DataSource) {
    const repository = dataSource.getRepository(User)

    const usersToSave = await Promise.all(
      rawUsers.map(async rawUser => ({
        ...rawUser,
        password: await argon2.hash(rawUser.password),
        userSettings: {}
      }))
    )

    return repository.save(usersToSave)
  }

  async saveFlashcardsData(dataSource: DataSource, usersIds: string[]) {
    const repository = dataSource.getRepository(Flashcard)

    const flashcardsToSave = await Promise.all(
      rawFlashcards.map(async rawFlashcard => ({
        ...rawFlashcard,
        userId: this.getRandomEntry(usersIds)
      }))
    )

    await repository.save(flashcardsToSave)
  }

  async saveNotesData(dataSource: DataSource, usersIds: string[]) {
    const repository = dataSource.getRepository(Note)

    const notesToSave = await Promise.all(
      rawNotes.map(async rawNotes => ({
        ...rawNotes,
        userId: this.getRandomEntry(usersIds)
      }))
    )

    await repository.save(notesToSave)
  }
}
