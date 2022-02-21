export interface UserPlaylog {
  id: number
  musicId: number
  musicTitle: number
  musicArtist: number
  score: number
  isClear: boolean
  isAllJustice: boolean
  isFullCombo: boolean
  isHighScore: boolean
  playDate: string
  difficulty: string
  judge: {
    justiceCritical: number
    justice: number
    attack: number
    miss: number
  }
}
