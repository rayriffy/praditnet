import { Knex } from 'knex'

import { capitalizeFirstCharacter } from '../../../../core/services/capitalizeFirstCharacter'

export const getEventMusics = async (
  eventId: string,
  knex: Knex,
  games: string[]
) => {
  const musics = await Promise.all(
    games.map(async game => {
      const musics = await knex('EventAuditionMusic')
        .where({
          eventId,
          gameId: game,
        })
        .join(
          `${capitalizeFirstCharacter(game)}Music`,
          'EventAuditionMusic.musicId',
          `${capitalizeFirstCharacter(game)}Music.id`
        )
        .select(
          `${capitalizeFirstCharacter(game)}Music.id as id`,
          `${capitalizeFirstCharacter(game)}Music.${
            game === 'chunithm' ? 'title' : 'name'
          } as name`,
          `EventAuditionMusic.level as targetDifficulty`,
          `${capitalizeFirstCharacter(game)}Music.level_expert`,
          `${capitalizeFirstCharacter(game)}Music.level_master`,
          ...(game === 'maimai'
            ? [`${capitalizeFirstCharacter(game)}Music.level_remaster`]
            : [])
        )

      return [
        game,
        musics.map(music => ({
          id: music.id,
          name: music.name,
          level: music.targetDifficulty,
          difficulty: music[`level_${music.targetDifficulty}`],
        })),
      ]
    })
  )

  return musics
}
