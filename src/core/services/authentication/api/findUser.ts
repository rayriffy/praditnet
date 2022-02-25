import { createKnexInstance } from '../../createKnexInstance'

import { UserAuth } from '../../../@types/db/UserAuth'

interface UserWithData extends UserAuth {
  card_luid: string | null
}

export const findUser = async (username: string): Promise<UserWithData> => {
  const knex = createKnexInstance()

  try {
    const users = await knex<UserAuth>('praditnet_user_auth')
      .where({
        username,
      })
      .join(
        'praditnet_user_data',
        'praditnet_user_auth.uid',
        '=',
        'praditnet_user_data.uid'
      )

    return users.find(user => user.username === username)
  } catch (e) {
    throw new Error('db-fail')
  } finally {
    knex.destroy()
  }
}
