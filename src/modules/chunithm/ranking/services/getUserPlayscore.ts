import { createKnexInstance } from '../../../../core/services/createKnexInstance'

export const getUserPlayscore = async (
  cardId: string,
  musicId: number,
  difficultyId: number
): Promise<number | null> => {
  const knex = await createKnexInstance()

  const playscores = await knex('chunew_user_music_detail')
    .join(
      'chunew_user_data',
      'chunew_user_music_detail.user_id',
      'chunew_user_data.id'
    )
    .join('sega_card', 'chunew_user_data.card_id', 'sega_card.id')
    .where('chunew_user_music_detail.music_id', musicId)
    .where('chunew_user_music_detail.level', difficultyId)
    .where('sega_card.luid', cardId)
    .select('score_max')

  await knex.destroy()

  if (playscores.length === 0) {
    return null
  } else {
    return playscores[0].score_max
  }
}
