export interface UserCard {
  card: {
    id: number
    name: string
    nickname: string
    serial: string
  }
  metadata: {
    use: number
    skill: {
      id: number
      name: string
      description: string
      category: string
    }
    exp: number
    level: {
      current: number
      max: number
    }
    upgrade: {
      kaika: string
      chokaika: string
    }
  }
}
