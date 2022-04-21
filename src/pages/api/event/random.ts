import { NextApiHandler } from 'next'
import { sortBy } from 'lodash'

import { getApiUserSession } from '../../../core/services/authentication/api/getApiUserSession'

import { createKnexInstance } from '../../../core/services/createKnexInstance'
import { serverCapcha } from '../../../core/services/serverCapcha'
import { SearchResult } from '../../../modules/event/randomizer/@types/SearchResult'

const api: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    const { eventId, gameId, pools, amount } = req.body

    try {
      await serverCapcha(req.headers['x-praditnet-capcha'] as string)
    } catch (e) {
      return res.status(400).send({
        message: e.message,
      })
    }

    const user = await getApiUserSession(req)
    const knex = createKnexInstance('praditnet')

    // make sure user is staff
    const targetStaff = await knex('EventStaff')
      .where({
        eventId: eventId,
        userId: user.uid,
      })
      .first()

    if (targetStaff === undefined) {
      await knex.destroy()
      return res.status(403).send({
        message: "you're not staff",
      })
    }

    // pick songs
    const targetMusicTable = `${
      gameId === 'maimai' ? 'Maimai' : 'Chunithm'
    }Music`
    const musics = await knex('EventMusic')
      .where({
        eventId,
        gameId,
      })
      .whereIn('poolId', pools)
      .orderByRaw('RAND()')
      .limit(amount)
      .join(targetMusicTable, 'EventMusic.musicId', `${targetMusicTable}.id`)
      .select(
        `${targetMusicTable}.id as id`,
        `${targetMusicTable}.artist as artist`,
        `${targetMusicTable}.${gameId === 'maimai' ? 'name' : 'title'} as name`,
        `EventMusic.difficulty as difficulty`,
        `${targetMusicTable}.level_master as level_master`,
        ...(gameId === 'maimai'
          ? [`${targetMusicTable}.level_remaster as level_remaster`]
          : [])
      )

    const searchResult: SearchResult = {
      musics: sortBy(
        musics.map(music => ({
          id: music.id,
          name: music.name,
          artist: music.artist,
          level: music[`level_${music.difficulty}`],
          difficulty: music.difficulty,
        })),
        ['level', 'id']
      ),
    }

    return res.status(200).send({
      message: 'done',
      data: searchResult,
    })
  } else {
    return res.status(405).send({
      message: 'invalid method',
    })
  }
}

export default api
