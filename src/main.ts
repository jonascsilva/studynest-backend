import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { AppModule } from '$/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get<ConfigService>(ConfigService)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  )

  const origin = configService.get('FRONTEND_URL')

  app.enableCors({
    origin: origin,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true
  })

  const port = configService.get('PORT')

  await app.listen(port)
}

bootstrap()
