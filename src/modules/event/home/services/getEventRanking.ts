import { Knex } from 'knex'

import { getGameEventRanking } from '../../../../core/services/getGameEventRanking'

export const getEventRanking = async (
  eventId: string,
  knex: Knex,
  targetUserId: string
): Promise<string> => {
  try {
    const targetEntry = await knex('EventAuditionRecord')
      .where({
        eventId,
        userId: targetUserId,
      })
      .first()

    if (targetEntry === undefined) {
      return '??'
    }

    const processedRecords = await getGameEventRanking(
      eventId,
      targetEntry.selectedGameId,
      knex
    )

    const targetRank =
      processedRecords.findIndex(o => o.id === targetUserId) + 1

    return targetRank === 0 ? '??' : targetRank.toLocaleString()
  } catch (e) {
    return '!!'
  }
}
