import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AppController } from '$/app.controller'
import { AppService } from '$/app.service'
import { Note } from '$/notes/note.entity'
import { NotesModule } from '$/notes/notes.module'
import { User } from '$/users/user.entity'
import { UsersModule } from '$/users/users.module'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ep-white-recipe-a4nzv9nx.us-east-1.aws.neon.tech',
      port: 5432,
      username: 'studynest_owner',
      password: '9SuvcNgdt7Pq',
      database: 'studynest',
      entities: [Note, User],
      synchronize: true,
      ssl: true
    }),
    UsersModule,
    NotesModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
