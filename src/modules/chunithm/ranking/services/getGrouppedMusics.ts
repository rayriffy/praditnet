import { groupBy, sortBy } from 'lodash'

import { difficulties } from '../constants/difficulties'
import { genres } from '../constants/genres'
import { createKnexInstance } from '../../../../core/services/createKnexInstance'

import { Difficulty } from '../@types/Difficulty'

export const getGrouppedMusics = async (inputDifficulty: Difficulty['key']) => {
  const knex = await createKnexInstance()

  const musics = await knex<{
    id: number
    title: string
    artist: string
    level_basic: number
    level_advanced: number
    level_expert: number
    level_master: number
    level_ultima: number
    genre: number
  }>('praditnet.ChunithmMusic')
    // filter out world's end
    .whereNot('level_basic', 0)

  await knex.destroy()

  const targetDifficulty = difficulties.find(o => o.key === inputDifficulty)

  const filteredMusics = musics.map(o => {
    return {
      id: o.id,
      name: o.title,
      level: o[`level_${targetDifficulty.key}`],
      genre: genres.find(g => g.id === o.genre).name,
    }
  })
  const grouppedMusics = groupBy(filteredMusics, 'genre')

  const processedMusics = Object.fromEntries(
    sortBy(
      Object.entries(grouppedMusics),
      ([key]) => genres.find(o => o.name === key).id
    ).map(([key, value]) => {
      return [
        key,
        sortBy(
          value.map(o => ({
            id: o.id,
            name: o.name,
            level: o.level,
          })),
          ['id']
        ),
      ]
    })
  )

  return processedMusics
}
