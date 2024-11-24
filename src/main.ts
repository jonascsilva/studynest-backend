import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'

import { AppModule } from '$/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  })
  const configService = app.get<ConfigService>(ConfigService)

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))

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

  const config = new DocumentBuilder()
    .setTitle('StudyNest API')
    .setVersion('0.4.0')
    .addBearerAuth()
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('api', app, documentFactory)

  const port = configService.get('PORT')

  await app.listen(port)
}

bootstrap()
