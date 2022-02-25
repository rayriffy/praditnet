import { createKnexInstance } from '../../../../core/services/createKnexInstance'

import { UserProfile } from '../@types/UserProfile'

export const getUserProfile = async (cardId: string): Promise<UserProfile> => {
  const knex = createKnexInstance()

  const userProfile = await knex('chunew_user_data')
    .join('sega_card', 'chunew_user_data.card_id', 'sega_card.id')
    .select(
      'user_name',
      'player_rating',
      'highest_rating',
      'frame_id',
      'trophy_id',
      'character_id',
      'nameplate_id',
      'voice_id'
    )
    .where({
      luid: cardId,
    })

  await knex.destroy()

  return {
    displayName: userProfile[0].user_name,
    rating: {
      current: userProfile[0].player_rating / 100,
      highest: userProfile[0].highest_rating / 100,
    },
    equipped: {
      frame: userProfile[0].frame_id,
      trophy: userProfile[0].trophy_id,
      character: userProfile[0].character_id,
      nameplate: userProfile[0].nameplate_id,
      voice: userProfile[0].voice_id,
    },
  }
}
