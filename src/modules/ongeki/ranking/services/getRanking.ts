import { createKnexInstance } from '../../../../core/services/createKnexInstance'

interface GetRankingReturn {
  playerName: string
  score: number
}

export const getRanking = async (
  musicId: number,
  difficultyId: number
): Promise<GetRankingReturn[]> => {
  const knex = createKnexInstance()

  const rankings = await knex('ongeki_user_music_detail')
    .join(
      'ongeki_user_data',
      'ongeki_user_music_detail.user_id',
      'ongeki_user_data.id'
    )
    .orderBy('ongeki_user_music_detail.tech_score_max', 'desc')
    .where('ongeki_user_music_detail.music_id', musicId)
    .where('ongeki_user_music_detail.level', difficultyId)
    .select(
      'ongeki_user_music_detail.tech_score_max as score',
      'ongeki_user_data.user_name as playerName'
    )
    .limit(10)

  await knex.destroy()

  return rankings.map(o => ({
    score: o.score,
    playerName: o.playerName,
  }))
}
