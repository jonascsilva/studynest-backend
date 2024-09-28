import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getIndex(): string {
    return 'Index route is working!'
  }
}
