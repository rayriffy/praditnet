export interface UserPlaylog {
  id: number
  musicId: number
  musicTitle: string
  musicArtist: string
  achievement: number
  isHighScore: boolean
  isAllPerfect: boolean
  isAllPerfectPlus: boolean
  isFullCombo: boolean
  playDate: string
  scoreDifficulty:
    | 'easy'
    | 'basic'
    | 'advanced'
    | 'expert'
    | 'master'
    | 'remaster'
    | 'utage'
  scoreLevel: number
  track: number
}
