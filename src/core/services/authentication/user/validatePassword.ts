import crypto from 'crypto'

import { User } from '../../../@types/User'

export const validatePassword = (user: User, inputPassword: string) => {
  const inputHash = crypto
    .pbkdf2Sync(inputPassword, user.salt, 1000, 64, 'sha512')
    .toString('hex')

  const passwordsMatch = user.hash === inputHash

  return passwordsMatch
}
