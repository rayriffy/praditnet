import { NextApiHandler } from 'next'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

import { capitalize, sortBy } from 'lodash'

import { createKnexInstance } from '../../../core/services/createKnexInstance'
import { getGameEventRanking } from '../../../core/services/getGameEventRanking'

const api: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {
    const eventId = req.query.eventId as string
    const gameId = req.query.gameId as string

    const knex = createKnexInstance('praditnet')
    try {
      const ranks = await getGameEventRanking(eventId, gameId, knex)

      const stringifyOrder = (order: number) =>
        ['st', 'nd', 'rd'][((((order + 90) % 100) - 10) % 10) - 1] || 'th'
      const stringifyScore = (score: number) =>
        gameId === 'maimai' ? `${score.toFixed(4)}%` : score.toLocaleString()

      const processedRanks = await Promise.all(
        ranks.map(async (rank, i) => {
          const scores = await knex('EventAuditionUser')
            .where({
              eventId: eventId,
              userId: rank.id,
              gameId,
              attempt: Number(rank.attempt),
            })
            .join(
              `${capitalize(gameId)}Music`,
              'EventAuditionUser.musicId',
              `${capitalize(gameId)}Music.id`
            )
            .select(
              `${capitalize(gameId)}Music.${
                gameId === 'chunithm' ? 'title' : 'name'
              } as musicTitle`,
              'EventAuditionUser.score as score'
            )

          return {
            id: rank.id,
            order: i,
            name: rank.name,
            score: Object.fromEntries(
              scores.map(o => [o.musicTitle, stringifyScore(o.score)])
            ),
            sums: stringifyScore(rank.score),
          }
        })
      )
      await knex.destroy()

      res.setHeader('Cache-Control', 'max-age=600')

      return res.status(200).send({
        message: 'done',
        updatedAt: dayjs().tz('Asia/Bangkok').format('DD MMM YYYY HH:mm:ss'),
        columns: Object.keys(processedRanks[0].score),
        ranks: sortBy(processedRanks, ['order']).map((rank, i) => ({
          ...rank,
          order: `${i + 1}${stringifyOrder(i)}`,
        })),
      })
    } catch (e) {
      await knex.destroy()

      return res.status(500).send({
        message: 'unexpected query error',
      })
    }
  } else {
    return res.status(405).send({
      message: 'invalid method',
    })
  }
}

export default api
