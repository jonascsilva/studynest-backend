import { Test, TestingModule } from '@nestjs/testing'

import { HashService } from '$/users/hash.service'

describe('HashService', () => {
  let hashService: HashService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashService]
    }).compile()

    hashService = module.get<HashService>(HashService)
  })

  it('should be defined', () => {
    expect(hashService).toBeDefined()
  })

  describe('hash', () => {
    it('should hash a password', async () => {
      const password = 'password123'

      const hash = await hashService.hash(password)

      expect(hash).toBeDefined()
      expect(typeof hash).toBe('string')
      expect(hash).not.toEqual(password)
    })

    it('should produce different hashes for the same password (due to salting)', async () => {
      const password = 'password123'

      const hash1 = await hashService.hash(password)
      const hash2 = await hashService.hash(password)

      expect(hash1).not.toEqual(hash2)
    })

    it('should produce different hashes for different passwords', async () => {
      const password1 = 'password123'
      const password2 = 'password456'

      const hash1 = await hashService.hash(password1)
      const hash2 = await hashService.hash(password2)

      expect(hash1).not.toEqual(hash2)
    })
  })

  describe('verify', () => {
    it('should verify a correct password', async () => {
      const password = 'password123'

      const hash = await hashService.hash(password)

      const result = await hashService.verify(hash, password)

      expect(result).toBe(true)
    })

    it('should not verify an incorrect password', async () => {
      const password = 'password123'
      const wrongPassword = 'wrongpassword'

      const hash = await hashService.hash(password)

      const result = await hashService.verify(hash, wrongPassword)

      expect(result).toBe(false)
    })

    it('should not verify if hash is tampered', async () => {
      const password = 'password123'

      const hash = await hashService.hash(password)

      const tamperedHash = hash.slice(0, -1) + '0'

      const result = await hashService.verify(tamperedHash, password)

      expect(result).toBe(false)
    })
  })
})
