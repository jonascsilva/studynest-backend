import * as argon2 from 'argon2'
import { setSeederFactory } from 'typeorm-extension'

import { UserSettings } from '$/users/user-settings.entity'
import { User } from '$/users/user.entity'

export default setSeederFactory(User, async faker => {
  const user = new User()

  user.name = faker.person.firstName()
  user.email = faker.internet.email()
  user.userSettings = {} as UserSettings

  const password = faker.internet.password()

  user.password = await argon2.hash(password)

  return user
})
