export interface UserProfile {
  displayName: string
  rating: {
    current: number
    highest: number
  }
  level: number
  playCount: number
  lastPlayed: string
  equipped: {
    card: number
    trophy: {
      id: number
      name: string
      rarity: string
    }
  }
}
