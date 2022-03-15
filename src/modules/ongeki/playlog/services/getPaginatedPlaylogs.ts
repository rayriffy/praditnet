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

export const getPaginatedPlaylogs = async (
  cardId: string,
  page: number = 1
) => {
  const knex = createKnexInstance()
  const [allPlaylogs, userPlaylogs] = await Promise.all([
    knex('ongeki_user_data')
      .join('sega_card', 'ongeki_user_data.aime_card_id', 'sega_card.id')
      .where({
        luid: cardId,
      })
      .join(
        'ongeki_user_playlog',
        'ongeki_user_data.id',
        'ongeki_user_playlog.user_id'
      )
      .count(),
    knex('ongeki_user_data')
      .join('sega_card', 'ongeki_user_data.aime_card_id', 'sega_card.id')
      .where({
        luid: cardId,
      })
      .join(
        'ongeki_user_playlog',
        'ongeki_user_data.id',
        'ongeki_user_playlog.user_id'
      )
      .join(
        'praditnet_ongeki_music',
        'ongeki_user_playlog.music_id',
        'praditnet_ongeki_music.id'
      )
      .orderBy('ongeki_user_playlog.user_play_date', 'desc')
      .select(
        // music
        'praditnet_ongeki_music.id as musicId',
        'praditnet_ongeki_music.name as musicTitle',
        // 'praditnet_chunithm_music.artist as musicArtist',
        'praditnet_ongeki_music.level_basic as musicLevel_basic',
        'praditnet_ongeki_music.level_advanced as musicLevel_advanced',
        'praditnet_ongeki_music.level_expert as musicLevel_expert',
        'praditnet_ongeki_music.level_master as musicLevel_master',
        'praditnet_ongeki_music.level_lunatic as musicLevel_lunatic',

        // playlog
        'ongeki_user_playlog.id as playId',
        'ongeki_user_playlog.user_play_date as playDate',
        'ongeki_user_playlog.level as playDifficulty',

        // battle
        'ongeki_user_playlog.battle_score as playBattleScore',
        'ongeki_user_playlog.battle_score_rank as playBattleRank',
        'ongeki_user_playlog.is_battle_new_record as playBattleNewRecord',

        // tech
        'ongeki_user_playlog.tech_score as playTechScore',
        'ongeki_user_playlog.tech_score_rank as playTechRank',
        'ongeki_user_playlog.is_tech_new_record as playTechNewRecord',

        // overdamage
        'ongeki_user_playlog.over_damage as playOverdamageDamage',
        'ongeki_user_playlog.is_over_damage_new_record as playOverdamageNewRecord',

        // judge
        'ongeki_user_playlog.judge_critical_break as playJudgeCritical',
        'ongeki_user_playlog.judge_break as playJudgeBreak',
        'ongeki_user_playlog.judge_hit as playJudgeHit',
        'ongeki_user_playlog.judge_miss as playJudgeMiss',
        'ongeki_user_playlog.damage_count as playJudgeDamage',

        // achivement
        'ongeki_user_playlog.is_all_break as playAchivementAllBreak',
        'ongeki_user_playlog.is_full_bell as playAchivementFullBell',
        'ongeki_user_playlog.is_full_combo as playAchivementFullCombo',

        // card
        'ongeki_user_playlog.card_id1 as playCard1Id',
        'ongeki_user_playlog.card_level1 as playCard1Level',
        'ongeki_user_playlog.card_attack1 as playCard1Attack',
        'ongeki_user_playlog.card_id2 as playCard2Id',
        'ongeki_user_playlog.card_level2 as playCard2Level',
        'ongeki_user_playlog.card_attack2 as playCard2Attack',
        'ongeki_user_playlog.card_id3 as playCard3Id',
        'ongeki_user_playlog.card_level3 as playCard3Level',
        'ongeki_user_playlog.card_attack3 as playCard3Attack'
      )
      .limit(paginationItems)
      .offset((page - 1) * paginationItems),
  ])

  await knex.destroy()

  const processedPlaylogs: UserPlaylog[] = userPlaylogs.map(playlog => {
    const difficulty: UserPlaylog['difficulty'] =
      playlog.playDifficulty === 10
        ? 'lunatic'
        : playlog.playDifficulty === 3
        ? 'master'
        : playlog.playDifficulty === 2
        ? 'expert'
        : playlog.playDifficulty === 1
        ? 'advanced'
        : 'basic'

    return {
      id: playlog.playId,
      playDate: dayjs.tz(playlog.playDate, 'Asia/Tokyo').format('lll'),
      music: {
        id: playlog.musicId,
        name: playlog.musicTitle,
      },
      difficulty,
      level: playlog[`musicLevel_${difficulty}`],
      battle: {
        score: playlog.playBattleScore,
        rank: playlog.playBattleRank,
        newRecord: playlog.playBattleNewRecord[0] === 1,
      },
      tech: {
        score: playlog.playTechScore,
        rank: playlog.playTechRank,
        newRecord: playlog.playTechNewRecord[0] === 1,
      },
      overDamage: {
        damage: playlog.playOverdamageDamage,
        newRecord: playlog.playOverdamageNewRecord[0] === 1,
      },
      judge: {
        critical: playlog.playJudgeCritical,
        break: playlog.playJudgeBreak,
        hit: playlog.playJudgeHit,
        miss: playlog.playJudgeMiss,
        damage: playlog.playJudgeDamage,
      },
      achivement: {
        allBreak: playlog.playAchivementAllBreak[0] === 1,
        fullBell: playlog.playAchivementFullBell[0] === 1,
        fullCombo: playlog.playAchivementFullCombo[0] === 1,
      },
      cards: [1, 0, 2].map(i => ({
        order: i,
        id: playlog[`playCard${i + 1}Id`],
        level: playlog[`playCard${i + 1}Level`],
        attack: playlog[`playCard${i + 1}Attack`],
      })),
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
