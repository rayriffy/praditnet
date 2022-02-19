export interface UserProfile {
  displayName: string
  rating: {
    current: number
    highest: number
  }
  equipped: {
    icon: number
    frame: number
    trophy: number
    nameplate: number
  }
}
