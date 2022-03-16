import { createKnexInstance } from '../../../../core/services/createKnexInstance'

export const getEquippedCharacter = async (cardId: string) => {
  const knex = createKnexInstance()

  const userProfile = await knex('ongeki_user_data')
    .join('sega_card', 'ongeki_user_data.aime_card_id', 'sega_card.id')
    .select('ongeki_user_data.character_id as characterId')
    .where({
      luid: cardId,
    })

  await knex.destroy()

  return {
    equipped: {
      character: userProfile[0].characterId,
    },
  }
}
