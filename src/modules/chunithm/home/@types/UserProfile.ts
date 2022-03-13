export interface UserProfile {
  displayName: string
  rating: {
    current: number
    highest: number
  }
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
