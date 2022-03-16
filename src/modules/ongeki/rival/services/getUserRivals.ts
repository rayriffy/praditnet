import { createKnexInstance } from '../../../../core/services/createKnexInstance'
import { Rival } from '../@types/Rival'

export const getUserRivals = async (cardId: string): Promise<Rival[]> => {
  const knex = createKnexInstance()
  const rivals = await knex('ongeki_user_rival')
    .join(
      'ongeki_user_data',
      'ongeki_user_rival.user_id',
      'ongeki_user_data.id'
    )
    .join('sega_card', 'ongeki_user_data.aime_card_id', 'sega_card.id')
    .where('sega_card.luid', '=', cardId)
    .select('ongeki_user_rival.rival_user_id as rivalUserId')

  const fetchedRivals: Rival[] = await Promise.all(
    rivals.map(async ({ rivalUserId }) => {
      const rival = await knex('ongeki_user_data')
        .where('id', '=', rivalUserId)
        .select(
          'id as rivalId',
          'user_name as rivalName',
          'level as rivalLevel',
          'card_id as rivalCardId',
          'player_rating as rivalRating'
        )
        .first()
      return {
        id: rival.rivalId,
        name: rival.rivalName,
        level: rival.rivalLevel,
        cardId: rival.rivalCardId,
        rating: rival.rivalRating / 100,
      }
    })
  )

  await knex.destroy()
  return fetchedRivals
}
