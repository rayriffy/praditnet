export interface UserProfile {
  displayName: string
  rating: {
    current: number
    highest: number
  }
  equipped: {
    frame: number
    trophy: number
    character: number
    nameplate: number
    voice: number
  }
}
