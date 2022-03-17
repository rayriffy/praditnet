import { createKnexInstance } from '../../../../core/services/createKnexInstance'

import { Rival } from '../@types/Rival'

export const getRivalsList = async (cardId: string) => {
  const knex = createKnexInstance()
  // make sure user slot not full yet
  const userRivals = await knex('ongeki_user_rival')
    .join(
      'ongeki_user_data',
      'ongeki_user_rival.user_id',
      'ongeki_user_data.id'
    )
    .join('sega_card', 'ongeki_user_data.aime_card_id', 'sega_card.id')
    .where('sega_card.luid', '=', cardId)
    .select(
      'ongeki_user_rival.rival_user_id as rivalUserId',
      'ongeki_user_rival.user_id as userId'
    )

  if (userRivals.length >= 3) {
    await knex.destroy()

    // maximum rival slot reached
    return {
      isSlotFull: true,
      availableRivals: [],
    }
  } else {
    // list all players
    const ongekiUsers = await knex('ongeki_user_data')
      .join('sega_card', 'ongeki_user_data.aime_card_id', 'sega_card.id')
      .select(
        'ongeki_user_data.id as rivalId',
        'ongeki_user_data.user_name as rivalName',
        'ongeki_user_data.level as rivalLevel',
        'ongeki_user_data.card_id as rivalCardId',
        'ongeki_user_data.player_rating as rivalRating',
        'sega_card.luid as segaLuid'
      )

    const processedRivals: Rival[] = ongekiUsers
      .filter(
        o =>
          userRivals.find(o => o.rivalUserId === o.rivalId) === undefined &&
          o.segaLuid !== cardId
      )
      .map(rival => ({
        id: rival.rivalId,
        name: rival.rivalName,
        level: rival.rivalLevel,
        cardId: rival.rivalCardId,
        rating: rival.rivalRating / 100,
      }))

    await knex.destroy()
    return {
      isSlotFull: false,
      availableRivals: processedRivals,
    }
  }
}
