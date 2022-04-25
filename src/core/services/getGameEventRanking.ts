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
  inGameName: string
}

export const getGameEventRanking = async (
  eventId: string,
  gameId: string,
  knex: Knex
) => {
  const records = await knex<DatabaseRecord>('EventAuditionUser')
    .where('EventAuditionUser.eventId', eventId)
    .where('EventAuditionUser.gameId', gameId)
    .join(
      'EventAuditionRecord',
      'EventAuditionUser.userId',
      'EventAuditionRecord.userId'
    )
    .select(
      'EventAuditionUser.id',
      'EventAuditionUser.eventId',
      'EventAuditionUser.userId',
      'EventAuditionUser.gameId',
      'EventAuditionUser.musicId',
      'EventAuditionUser.score',
      'EventAuditionUser.metadata',
      'EventAuditionUser.attempt',
      'EventAuditionUser.recordedBy',
      'EventAuditionUser.createdAt',
      'EventAuditionRecord.inGameName'
    )

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
                  name: val[0].inGameName,
                  attemptedAt: val[0].createdAt,
                }
              }
            ),
            ['sum']
          )
        ) ?? {
          sum: 0,
          name: '',
          attemptedAt: new Date('1990-01-01'),
        }

        return {
          id: userId,
          name: grouppedAttmpts.name,
          score: grouppedAttmpts.sum,
          attemptedAt: (grouppedAttmpts.attemptedAt as Date).toISOString(),
        }
      }),
      ['score', 'attemptedAt']
    )
  )

  return processedRecords
}
