import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston'
import * as winston from 'winston'

import { AppController } from '$/app.controller'
import { AppService } from '$/app.service'
import { AuthModule } from '$/auth/auth.module'
import { DbModule } from '$/db/db.module'
import { FlashcardsModule } from '$/flashcards/flashcards.module'
import { NotesModule } from '$/notes/notes.module'
import { SettingsModule } from '$/settings/settings.module'
import { UsersModule } from '$/users/users.module'

@Module({
  imports: [
    WinstonModule.forRoot({
      level: 'debug',
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('NewRelicExampleApp', {
              colors: true,
              prettyPrint: true
            })
          )
        })
      ]
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, `.env.${process.env.NODE_ENV}.local`]
    }),
    DbModule,
    UsersModule,
    NotesModule,
    FlashcardsModule,
    AuthModule,
    SettingsModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
