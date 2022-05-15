import { NextApiHandler } from 'next'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

import { createKnexInstance } from '../../../core/services/createKnexInstance'
import { getGameEventRanking } from '../../../core/services/getGameEventRanking'

const api: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {
    const eventId = req.query.eventId as string
    const gameId = req.query.gameId as string

    const knex = createKnexInstance('praditnet')
    try {
      const ranks = await getGameEventRanking(eventId, gameId, knex)
      await knex.destroy()

      const stringifyOrder = (order: number) =>
        ['st', 'nd', 'rd'][((((order + 90) % 100) - 10) % 10) - 1] || 'th'

      res.setHeader('Cache-Control', 'max-age=600')

      return res.status(200).send({
        message: 'done',
        updatedAt: dayjs().tz('Asia/Bangkok').format('DD MMM YYYY HH:mm:ss'),
        ranks: ranks.slice(0, 16).map((o, i) => ({
          id: o.id,
          order: `${i + 1}${stringifyOrder(i + 1)}`,
          name: o.name,
          score:
            gameId === 'maimai'
              ? `${o.score.toFixed(4)}%`
              : o.score.toLocaleString(),
        })),
      })
    } catch (e) {
      await knex.destroy()

      console.log(e)

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
