import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getIndex(): string {
    const packageVersion = this.configService.get('npm_package_version')

    return `Index route is working on version ${packageVersion}!`
  }
}
