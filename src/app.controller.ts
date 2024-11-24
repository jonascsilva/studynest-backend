import { Controller, Get, UseInterceptors } from '@nestjs/common'

import { AppService } from '$/app.service'
import { LoggingInterceptor } from '$/logging.interceptors'

@UseInterceptors(LoggingInterceptor)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getIndex(): string {
    return this.appService.getIndex()
  }
}
