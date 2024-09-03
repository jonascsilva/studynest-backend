import { scryptSync } from 'crypto'

const hashPassword = (password: string) => {
  const salt = password
  const hashedPassword = scryptSync(password, salt, 64).toString('hex')

  return hashedPassword
}

export { hashPassword }
