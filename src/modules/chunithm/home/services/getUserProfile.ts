import { createKnexInstance } from '../../../../core/services/createKnexInstance'

import { UserProfile } from '../@types/UserProfile'

export const getUserProfile = async (cardId: string): Promise<UserProfile> => {
  const knex = createKnexInstance()

  const userProfile = await knex('chunew_user_data')
    .join('sega_card', 'chunew_user_data.card_id', 'sega_card.id')
    .join(
      'praditnet.ChunithmTrophy',
      'chunew_user_data.trophy_id',
      'praditnet.ChunithmTrophy.id'
    )
    .select(
      'chunew_user_data.user_name as username',
      'chunew_user_data.player_rating as playerRating',
      'chunew_user_data.highest_rating as highestRating',
      'chunew_user_data.level as level',
      'chunew_user_data.play_count as playCount',
      'chunew_user_data.over_power_rate as overpower',
      'chunew_user_data.last_play_date as lastPlayed',
      'chunew_user_data.frame_id as frameId',
      'chunew_user_data.trophy_id as trophyId',
      'chunew_user_data.character_id as characterId',
      'chunew_user_data.nameplate_id as nameplateId',
      'chunew_user_data.voice_id as voiceId',
      'praditnet.ChunithmTrophy.name as trophyName',
      'praditnet.ChunithmTrophy.rarity as trophyRarity'
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
    level: userProfile[0].level,
    playCount: userProfile[0].playCount,
    overpower: userProfile[0].overpower,
    lastPlayed: userProfile[0].lastPlayed.toISOString(),
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
