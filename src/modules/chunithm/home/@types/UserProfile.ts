export interface UserProfile {
  displayName: string
  rating: {
    current: number
    highest: number
  }
  level: number
  playCount: number
  overpower: number
  lastPlayed: string
  equipped: {
    frame: number
    trophy: {
      id: number
      name: string
      rarity: number
    }
    character: number
    nameplate: number
    voice: number
  }
}
