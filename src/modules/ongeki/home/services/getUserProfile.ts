import dayjs from 'dayjs'

import { createKnexInstance } from '../../../../core/services/createKnexInstance'

import { UserProfile } from '../@types/UserProfile'

export const getUserProfile = async (cardId: string): Promise<UserProfile> => {
  const knex = createKnexInstance()

  const userProfile = await knex('ongeki_user_data')
    .join('sega_card', 'ongeki_user_data.aime_card_id', 'sega_card.id')
    .join(
      'praditnet.OngekiTrophy',
      'ongeki_user_data.trophy_id',
      'praditnet.OngekiTrophy.id'
    )
    .select(
      'ongeki_user_data.user_name as username',
      'ongeki_user_data.player_rating as playerRating',
      'ongeki_user_data.highest_rating as highestRating',
      'ongeki_user_data.level as level',
      'ongeki_user_data.play_count as playCount',
      'ongeki_user_data.last_play_date as lastPlayed',
      'ongeki_user_data.card_id as cardId',
      'praditnet.OngekiTrophy.id as trophyId',
      'praditnet.OngekiTrophy.name as trophyName',
      'praditnet.OngekiTrophy.rarity as trophyRarity'
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
    lastPlayed: dayjs(userProfile[0].lastPlayed).toISOString(),
    equipped: {
      card: userProfile[0].cardId,
      trophy: {
        id: userProfile[0].trophyId,
        name: userProfile[0].trophyName,
        rarity: userProfile[0].trophyRarity,
      },
    },
  }
}
