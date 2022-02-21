import chunk from 'lodash/chunk'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import { createKnexInstance } from '../../../../core/services/createKnexInstance'
import { paginationItems } from '../../../../core/constants/paginationItems'

import { UserPlaylog } from '../@types/UserPlaylog'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localizedFormat)

export const getPaginatedPlaylogs = async (page: number = 1) => {
  const knex = createKnexInstance()
  const [allPlaylogs, userPlaylogs] = await Promise.all([
    knex('chunew_user_data')
      .join('sega_card', 'chunew_user_data.card_id', 'sega_card.id')
      .where({
        luid: process.env.DEMO_LUID,
      })
      .join(
        'chunew_user_playlog',
        'chunew_user_data.id',
        'chunew_user_playlog.user_id'
      )
      .count(),
    knex('chunew_user_data')
      .join('sega_card', 'chunew_user_data.card_id', 'sega_card.id')
      .where({
        luid: process.env.DEMO_LUID,
      })
      .join(
        'chunew_user_playlog',
        'chunew_user_data.id',
        'chunew_user_playlog.user_id'
      )
      .join(
        'praditnet_chunithm_music',
        'chunew_user_playlog.music_id',
        'praditnet_chunithm_music.id'
      )
      .orderBy('chunew_user_playlog.user_play_date', 'desc')
      .select(
        'praditnet_chunithm_music.id as musicId',
        'praditnet_chunithm_music.title as musicTitle',
        'praditnet_chunithm_music.artist as musicArtist',
        'chunew_user_playlog.id as playId',
        'chunew_user_playlog.score as playScore',
        'chunew_user_playlog.track as playTrack',
        'chunew_user_playlog.is_clear as playIsClear',
        'chunew_user_playlog.is_all_justice as playIsAllJustice',
        'chunew_user_playlog.is_full_combo as playIsFullCombo',
        'chunew_user_playlog.is_new_record as playIsHighScore',
        'chunew_user_playlog.user_play_date as playDate',
        'chunew_user_playlog.judge_attack as judgeAttack',
        'chunew_user_playlog.judge_critical as judgeCritical',
        'chunew_user_playlog.judge_guilty as judgeGuilty',
        'chunew_user_playlog.judge_justice as judgeJustice',
        'chunew_user_playlog.judge_heaven as judgeHeaven',
        'chunew_user_playlog.level as difficulty'
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
      score: playlog.playScore,
      track: playlog.playTrack,
      isClear: playlog.playIsClear === 1,
      isAllJustice: playlog.playIsAllJustice === 1,
      isFullCombo: playlog.playIsFullCombo === 1,
      isHighScore: playlog.playIsHighScore === 1,
      difficulty:
        playlog.difficulty === 5
          ? "world's end"
          : playlog.difficulty === 4
          ? 'ultima'
          : playlog.difficulty === 3
          ? 'master'
          : playlog.difficulty === 2
          ? 'expert'
          : playlog.difficulty === 1
          ? 'advanced'
          : 'basic',
      judge: {
        justiceCritical: playlog.judgeCritical + playlog.judgeHeaven,
        justice: playlog.judgeJustice,
        attack: playlog.judgeAttack,
        miss: playlog.judgeGuilty,
      },
      playDate: dayjs.tz(playlog.playDate, 'Asia/Tokyo').format('lll'),
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
