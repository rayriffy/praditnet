import { Knex } from 'knex'

import { UserPreview } from '../@types/UserPreview'

export const getFinaleUserPreview = async (
  cardId: string,
  knex: Knex
): Promise<UserPreview> => {
  const data = await knex('maimai_user_data')
    .join('sega_card', 'maimai_user_data.aime_card_id', 'sega_card.id')
    .select('user_name', 'player_rating')
    .where({
      luid: cardId,
    })

  if (data.length === 0) {
    return null
  } else {
    return {
      name: data[0].user_name,
      rating: data[0].player_rating / 100,
    }
  }
}
