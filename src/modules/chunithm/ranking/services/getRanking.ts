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

  const rankings = await knex('chunew_user_music_detail')
    .join(
      'chunew_user_data',
      'chunew_user_music_detail.user_id',
      'chunew_user_data.id'
    )
    .orderBy('chunew_user_music_detail.score_max', 'desc')
    .where('chunew_user_music_detail.music_id', musicId)
    .where('chunew_user_music_detail.level', difficultyId)
    .select(
      'chunew_user_music_detail.score_max as score',
      'chunew_user_data.user_name as playerName'
    )
    .limit(10)

  await knex.destroy()

  return rankings.map(o => ({
    score: o.score,
    playerName: o.playerName,
  }))
}
