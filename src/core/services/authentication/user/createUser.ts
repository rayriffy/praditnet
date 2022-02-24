import crypto from 'crypto'
import { nanoid } from 'nanoid'
import dayjs from 'dayjs'

import { UserAuth } from '../../../@types/db/UserAuth'
import { createKnexInstance } from '../../createKnexInstance'

export const createUser = async (username: string, password: string) => {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex')

  const payload = {
    uid: nanoid(),
    createdAt: dayjs().toDate(),
    username,
    hash,
    salt,
  }

  const knex = createKnexInstance()

  try {
    await knex<UserAuth>('praditnet_user_auth').insert(payload)

    return {
      username,
      createdAt: payload.createdAt,
    }
  } catch (e) {
    throw new Error('dupe-username')
  } finally {
    knex.destroy()
  }
}
