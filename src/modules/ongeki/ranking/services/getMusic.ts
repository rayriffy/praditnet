import { createKnexInstance } from '../../../../core/services/createKnexInstance'

import { Difficulty } from '../@types/Difficulty'

interface GetMusicReturn {
  id: number
  name: string
  artist: string
  level: number
}

export const getMusic = async (
  musicId: number,
  difficultyKey: Difficulty['key']
): Promise<GetMusicReturn | null> => {
  const knex = createKnexInstance()

  const musics = await knex('praditnet_ongeki_music').where({
    id: musicId,
  })

  await knex.destroy()

  if (musics.length === 0) {
    return null
  } else {
    return {
      id: musics[0].id,
      name: musics[0].name,
      artist: musics[0].artist,
      level: musics[0][`level_${difficultyKey}`],
    }
  }
}
