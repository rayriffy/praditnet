
import { createKnexInstance } from '../../../../core/services/createKnexInstance'

import { UserProfile } from '../@types/UserProfile'

export const getUserProfile = async (): Promise<UserProfile> => {
  const knex = createKnexInstance()

  const userProfile = await knex('maimai_user_data')
    .join('sega_card', 'maimai_user_data.aime_card_id', 'sega_card.id')
    .select(
      'user_name',
      'player_rating',
      'highest_rating',
      'nameplate_id',
      'icon_id',
      'frame_id',
      'trophy_id'
    )
    .where({
      luid: process.env.DEMO_LUID,
    })

  await knex.destroy()

  return {
    displayName: userProfile[0].user_name,
    rating: {
      current: userProfile[0].player_rating / 100,
      highest: userProfile[0].highest_rating / 100,
    },
    equipped: {
      icon: userProfile[0].icon_id,
      frame: userProfile[0].frame_id,
      trophy: userProfile[0].trophy_id,
      nameplate: userProfile[0].nameplate_id,
    },
  }
}
