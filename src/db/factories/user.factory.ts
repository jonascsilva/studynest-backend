import * as argon2 from 'argon2'
import { setSeederFactory } from 'typeorm-extension'

import { User } from '$/users/user.entity'

export default setSeederFactory(User, async faker => {
  const user = new User()

  user.name = faker.person.firstName()
  user.email = faker.internet.email()

  const password = faker.internet.password()

  user.password = await argon2.hash(password)

  return user
})
