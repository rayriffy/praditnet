import chunk from 'lodash/chunk'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import { createKnexInstance } from '../../../../core/services/createKnexInstance'
import { paginationItems } from '../../../../core/constants/paginationItems'

import { UserPlaylog } from '../../home/@types/UserPlaylog'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localizedFormat)

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
        'praditnet.FinaleMusic',
        'maimai_user_playlog.music_id',
        'praditnet.FinaleMusic.id'
      )
      .join('praditnet.FinaleScore', {
        'praditnet.FinaleScore.music': 'maimai_user_playlog.music_id',
        'praditnet.FinaleScore.difficulty': 'maimai_user_playlog.level',
      })
      .orderBy('maimai_user_playlog.user_play_date', 'desc')
      .select(
        'praditnet.FinaleMusic.id as musicId',
        'praditnet.FinaleMusic.title as musicTitle',
        'praditnet.FinaleMusic.artist as musicArtist',
        'maimai_user_playlog.id as playId',
        'maimai_user_playlog.track as playTrack',
        'maimai_user_playlog.achievement as playAchievement',
        'maimai_user_playlog.is_high_score as playIsHighScore',
        'maimai_user_playlog.is_all_perfect as playIsAllPerfect',
        'maimai_user_playlog.is_all_perfect_plus as playIsAllPerfectPlus',
        'maimai_user_playlog.full_combo as playIsFullCombo',
        'maimai_user_playlog.user_play_date as playDate',
        'maimai_user_playlog.level as scoreDifficulty',
        'praditnet.FinaleScore.level as scoreLevel',

        // judge: perfect
        'maimai_user_playlog.tap_perfect as judgeTapPerfect',
        'maimai_user_playlog.hold_perfect as judgeHoldPerfect',
        'maimai_user_playlog.slide_perfect as judgeSlidePerfect',
        'maimai_user_playlog.break_perfect as judgeBreakPerfect',

        // judge: great
        'maimai_user_playlog.tap_great as judgeTapGreat',
        'maimai_user_playlog.hold_great as judgeHoldGreat',
        'maimai_user_playlog.slide_great as judgeSlideGreat',
        'maimai_user_playlog.break_great as judgeBreakGreat',

        // judge: good
        'maimai_user_playlog.tap_good as judgeTapGood',
        'maimai_user_playlog.hold_good as judgeHoldGood',
        'maimai_user_playlog.slide_good as judgeSlideGood',
        'maimai_user_playlog.break_good as judgeBreakGood',

        // judge: miss
        'maimai_user_playlog.tap_bad as judgeTapMiss',
        'maimai_user_playlog.hold_bad as judgeHoldMiss',
        'maimai_user_playlog.slide_bad as judgeSlideMiss',
        'maimai_user_playlog.break_bad as judgeBreakMiss'
      )
      .limit(paginationItems)
      .offset((page - 1) * paginationItems),
  ])

  await knex.destroy()

  const processedPlaylogs: UserPlaylog[] = userPlaylogs.map(playlog => {
    const difficulty: UserPlaylog['scoreDifficulty'] =
      playlog.scoreDifficulty === 6
        ? 'remaster'
        : playlog.scoreDifficulty === 5
        ? 'master'
        : playlog.scoreDifficulty === 4
        ? 'expert'
        : playlog.scoreDifficulty === 3
        ? 'advanced'
        : playlog.scoreDifficulty === 2
        ? 'easy'
        : playlog.scoreDifficulty === 1
        ? 'basic'
        : 'utage'

    const sumJudge = (key: string) =>
      [
        `judgeTap${key}`,
        `judgeHold${key}`,
        `judgeSlide${key}`,
        `judgeBreak${key}`,
      ].reduce((acc, cur) => acc + (playlog[cur] ?? 0), 0)

    return {
      id: playlog.playId,
      musicId: playlog.musicId,
      musicTitle: playlog.musicTitle,
      musicArtist: playlog.musicArtist,
      achievement: playlog.playAchievement / 100,
      isHighScore: playlog.playIsHighScore !== 0,
      isAllPerfect: playlog.playIsAllPerfect[0] !== 0,
      isAllPerfectPlus: playlog.playIsAllPerfectPlus !== 0,
      isFullCombo: playlog.playIsFullCombo !== 0,
      playDate: dayjs.tz(playlog.playDate, 'Asia/Tokyo').format('lll'),
      scoreLevel: playlog.scoreDifficulty,
      scoreDifficulty: difficulty,
      track: playlog.playTrack,
      scnum: playlog.scoreDifficulty,
      judge: {
        perfect: sumJudge('Perfect'),
        great: sumJudge('Great'),
        good: sumJudge('Good'),
        miss: sumJudge('Miss'),
      },
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
