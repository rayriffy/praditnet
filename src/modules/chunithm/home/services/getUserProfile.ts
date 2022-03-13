import { createKnexInstance } from '../../../../core/services/createKnexInstance'

import { UserProfile } from '../@types/UserProfile'

export const getUserProfile = async (cardId: string): Promise<UserProfile> => {
  const knex = createKnexInstance()

  const userProfile = await knex('chunew_user_data')
    .join('sega_card', 'chunew_user_data.card_id', 'sega_card.id')
    .join(
      'praditnet_chunithm_trophy',
      'chunew_user_data.trophy_id',
      'praditnet_chunithm_trophy.id'
    )
    .select(
      'chunew_user_data.user_name as username',
      'chunew_user_data.player_rating as playerRating',
      'chunew_user_data.highest_rating as highestRating',
      'chunew_user_data.frame_id as frameId',
      'chunew_user_data.trophy_id as trophyId',
      'chunew_user_data.character_id as characterId',
      'chunew_user_data.nameplate_id as nameplateId',
      'chunew_user_data.voice_id as voiceId',
      'praditnet_chunithm_trophy.name as trophyName',
      'praditnet_chunithm_trophy.rarity as trophyRarity'
    )
    .where({
      luid: cardId,
    })

  await knex.destroy()

  return {
    displayName: userProfile[0].username,
    rating: {
      current: userProfile[0].playerRating / 100,
      highest: userProfile[0].highestRating / 100,
    },
    equipped: {
      frame: userProfile[0].frameId,
      trophy: {
        id: userProfile[0].trophyId,
        name: userProfile[0].trophyName,
        rarity: userProfile[0].trophyRarity,
      },
      character: userProfile[0].characterId,
      nameplate: userProfile[0].nameplateId,
      voice: userProfile[0].voiceId,
    },
  }
}
