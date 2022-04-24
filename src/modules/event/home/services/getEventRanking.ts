import { Knex } from 'knex'
import { groupBy, sortBy, reverse, last } from 'lodash'

interface DatabaseRecord {
  id: number
  eventId: string
  userId: string
  gameId: string
  musicId: number
  score: number
  metadata: string
  attempt: number
  recordedBy: string
  createdAt: Date
}

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

    const records = await knex<DatabaseRecord>('EventAuditionUser').where({
      eventId: eventId,
      gameId: targetEntry.selectedGameId,
    })

    const groupedRecords = groupBy(records, 'userId')
    const processedRecords = reverse(
      sortBy(
        Object.entries(groupedRecords).map(([userId, scores]) => {
          const grouppedAttmpts = last(
            sortBy(
              Object.entries(groupBy(scores, o => o.attempt)).map(
                ([key, val]) => {
                  return {
                    sum: val.reduce((acc, val) => acc + val.score, 0),
                    attemptedAt: val[0].createdAt,
                  }
                }
              ),
              ['sum']
            )
          ) ?? {
            sum: 0,
            attemptedAt: new Date('1990-01-01'),
          }

          return {
            id: userId,
            score: grouppedAttmpts.sum,
            attemptedAt: (grouppedAttmpts.attemptedAt as Date).toISOString(),
          }
        }),
        ['score', 'attemptedAt']
      )
    )

    const targetRank =
      processedRecords.findIndex(o => o.id === targetUserId) + 1

    return targetRank === 0 ? '??' : targetRank.toLocaleString()
  } catch (e) {
    return '!!'
  }
}
