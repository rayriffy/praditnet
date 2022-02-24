import { createKnexInstance } from '../../createKnexInstance'

import { UserAuth } from '../../../@types/db/UserAuth'

export const findUser = async (username: string) => {
  const knex = createKnexInstance()

  try {
    const users = await knex<UserAuth>('praditnet_user_auth').where({
      username,
    })

    return users.find(user => user.username === username)
  } catch (e) {
    throw new Error('db-fail')
  } finally {
    knex.destroy()
  }
}
