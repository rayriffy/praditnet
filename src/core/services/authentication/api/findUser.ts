import { createKnexInstance } from '../../createKnexInstance'

import { UserAuth } from '../../../@types/db/UserAuth'

interface UserWithData extends UserAuth {
  card_luid: string | null
  god_mode: number
}

export const findUser = async (username: string): Promise<UserWithData> => {
  const knex = createKnexInstance()

  try {
    const users = await knex<UserAuth>('praditnet.UserAuth')
      .where({
        username,
      })
      .join(
        'praditnet.UserData',
        'praditnet.UserAuth.uid',
        '=',
        'praditnet.UserData.uid'
      )

    return users.find(user => user.username === username)
  } catch (e) {
    throw new Error('db-fail')
  } finally {
    knex.destroy()
  }
}
