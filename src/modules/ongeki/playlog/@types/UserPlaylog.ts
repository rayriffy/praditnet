export interface UserPlaylog {
  id: number
  playDate: string
  music: {
    id: number
    name: number
  }
  difficulty: 'basic' | 'advanced' | 'expert' | 'master' | 'lunatic' // 0, 1, 2, 3, 10
  level: number
  battle: {
    // point: number
    score: number
    rank: number
    newRecord: boolean
  }
  tech: {
    score: number
    rank: number
    newRecord: boolean
  }
  overDamage: {
    damage: number
    newRecord: boolean
  }
  judge: {
    critical: number
    break: number
    hit: number
    miss: number
    damage: number
  }
  bell: {
    actual: number
    total: number
  }
  achivement: {
    allBreak: boolean
    fullBell: boolean
    fullCombo: boolean
  }
  cards: {
    order: number
    id: string
    // name: string
    // skill: string
    level: number
    attack: number
  }[]
}
