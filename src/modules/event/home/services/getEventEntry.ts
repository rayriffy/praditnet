import { Knex } from 'knex'
import { groupBy, last, sortBy } from 'lodash'

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
    const targetEntry = await knex('EventAuditionRecord')
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

      // group by attempts
      const grouppedAttmpts = sortBy(
        Object.entries(groupBy(attemptLogs, o => o.attempt)).map(
          ([key, val]) => {
            return {
              sum: val.reduce((acc, val) => acc + val.score, 0),
              logs: val,
            }
          }
        ),
        ['sum']
      )

      // get highest sum
      const targetAttempts = last(grouppedAttmpts)?.logs ?? []

      entry = {
        game: targetEntry.selectedGameId,
        inGameName: targetEntry.inGameName,
        remainingAttempts: targetEntry.remainingAttempts,
        attemptLog: targetAttempts.map(item => [
          item.musicId,
          item.score,
          item.metadata,
        ]),
      }
    }
  }

  return entry
}
