export interface UserPlaylog {
  id: number
  musicId: number
  musicTitle: number
  // musicArtist: number
  score: number
  track: number
  isClear: boolean
  isAllJustice: boolean
  isFullChain: boolean
  isFullCombo: boolean
  isHighScore: boolean
  playDate: string
  difficulty: string
  level: number
  judge: {
    justiceCritical: number
    justice: number
    attack: number
    miss: number
  }
}
