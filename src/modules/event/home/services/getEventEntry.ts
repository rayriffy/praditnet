import { Knex } from 'knex'

import { UserWithData } from '../../../../core/@types/UserWithData'
import { Props } from '../../../../pages/event/[eventId]'

export const getEventEntry = async (
  eventId: string,
  knex: Knex,
  user: UserWithData
) => {
  let entry: Props['entry'] = null
  if (user !== null && user !== undefined) {
    // get user entry if exist
    const targetEntry = await knex('EventAuditionRegister')
      .where({
        eventId,
        userId: user.uid,
      })
      .first()

    if (targetEntry !== undefined) {
      // get attempt logs
      const attemptLogs = await knex('EventAuditionUser').where({
        eventId,
        userId: user.uid,
        gameId: targetEntry.selectedGameId,
      })

      entry = {
        game: targetEntry.selectedGameId,
        inGameName: targetEntry.inGameName,
        remainingAttempts: targetEntry.remainingAttempts,
        attemptLog: attemptLogs.map(item => [item.musicId, item.score]),
      }
    }
  }

  return entry
}
