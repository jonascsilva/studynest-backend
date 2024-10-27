import { config } from 'dotenv'
import { DataSource, DataSourceOptions } from 'typeorm'
import { SeederOptions } from 'typeorm-extension'

config({
  path: [`.env.seed.local`, `.env.${process.env.NODE_ENV}`, `.env.${process.env.NODE_ENV}.local`]
})

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  ssl: true,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  migrationsRun: process.env.NODE_ENV === 'development',

  seeds: ['dist/db/seeds/**/*.js'],
  factories: ['dist/db/factories/**/*.js']
}

export const dataSource = new DataSource(dataSourceOptions)
