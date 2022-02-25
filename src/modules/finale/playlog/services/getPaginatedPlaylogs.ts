import chunk from 'lodash/chunk'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

import { createKnexInstance } from '../../../../core/services/createKnexInstance'
import { paginationItems } from '../../../../core/constants/paginationItems'

import { UserPlaylog } from '../../home/@types/UserPlaylog'

dayjs.extend(utc)
dayjs.extend(timezone)

export const getPaginatedPlaylogs = async (
  cardId: string,
  page: number = 1
) => {
  const knex = createKnexInstance()
  const [allPlaylogs, userPlaylogs] = await Promise.all([
    knex('maimai_user_data')
      .join('sega_card', 'maimai_user_data.aime_card_id', 'sega_card.id')
      .where({
        luid: cardId,
      })
      .join(
        'maimai_user_playlog',
        'maimai_user_data.id',
        'maimai_user_playlog.user_id'
      )
      .count(),
    knex('maimai_user_data')
      .join('sega_card', 'maimai_user_data.aime_card_id', 'sega_card.id')
      .where({
        luid: cardId,
      })
      .join(
        'maimai_user_playlog',
        'maimai_user_data.id',
        'maimai_user_playlog.user_id'
      )
      .join(
        'praditnet_finale_music',
        'maimai_user_playlog.music_id',
        'praditnet_finale_music.id'
      )
      .orderBy('maimai_user_playlog.user_play_date', 'desc')
      .select(
        'praditnet_finale_music.id as musicId',
        'praditnet_finale_music.title as musicTitle',
        'praditnet_finale_music.artist as musicArtist',
        'maimai_user_playlog.id as playId',
        'maimai_user_playlog.achievement as playAchievement',
        'maimai_user_playlog.is_all_perfect as playIsAllPerfect',
        'maimai_user_playlog.is_all_perfect_plus as playIsAllPerfectPlus',
        'maimai_user_playlog.full_combo as playIsFullCombo',
        'maimai_user_playlog.user_play_date as playDate'
      )
      .limit(paginationItems)
      .offset((page - 1) * paginationItems),
  ])

  await knex.destroy()

  const processedPlaylogs: UserPlaylog[] = userPlaylogs.map(playlog => {
    return {
      id: playlog.playId,
      musicId: playlog.musicId,
      musicTitle: playlog.musicTitle,
      musicArtist: playlog.musicArtist,
      achievement: playlog.playAchievement / 100,
      isAllPerfect: playlog.playIsAllPerfect[0] !== 0,
      isAllPerfectPlus: playlog.playIsAllPerfectPlus !== 0,
      isFullCombo: playlog.playIsFullCombo !== 0,
      playDate: dayjs.tz(playlog.playDate, 'Asia/Tokyo').toISOString(),
    }
  })

  return {
    page: page,
    maxPage: chunk(
      Array.from({ length: allPlaylogs[0]['count(*)'] as number }),
      paginationItems
    ).length,
    playlogs: processedPlaylogs,
  }
}
