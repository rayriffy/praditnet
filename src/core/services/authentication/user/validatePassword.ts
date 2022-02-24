import crypto from 'crypto'

import { UserAuth } from '../../../@types/db/UserAuth'

export const validatePassword = (user: UserAuth, inputPassword: string) => {
  const inputHash = crypto
    .pbkdf2Sync(inputPassword, user.salt, 1000, 64, 'sha512')
    .toString('hex')

  const passwordsMatch = user.hash === inputHash

  return passwordsMatch
}
