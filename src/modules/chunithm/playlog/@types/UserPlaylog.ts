export interface UserPlaylog {
  id: number
  musicId: number
  musicTitle: number
  musicArtist: number
  score: number
  isClear: number
  isAllJustice: number
  isFullCombo: number
  playDate: string
  judge: {
    justiceCritical: number
    justice: number
    attack: number
    miss: number
  }
}
