import { createKnexInstance } from '../../../../core/services/createKnexInstance'

export const getUserPlayscore = async (
  cardId: string,
  musicId: number,
  difficultyId: number
): Promise<number | null> => {
  const knex = await createKnexInstance()

  const playscores = await knex('ongeki_user_music_detail')
    .join(
      'ongeki_user_data',
      'ongeki_user_music_detail.user_id',
      'ongeki_user_data.id'
    )
    .join('sega_card', 'ongeki_user_data.aime_card_id', 'sega_card.id')
    .where('ongeki_user_music_detail.music_id', musicId)
    .where('ongeki_user_music_detail.level', difficultyId)
    .where('sega_card.luid', cardId)
    .select('ongeki_user_music_detail.tech_score_max as score')

  await knex.destroy()

  if (playscores.length === 0) {
    return null
  } else {
    return playscores[0].score
  }
}
