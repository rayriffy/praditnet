export interface Card {
  order: number
  id: number
  name: string
  attribute: string
  skill: {
    id: number
    name: string
  }
  level: {
    current: number
    max: number
  }
}
