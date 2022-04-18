export interface SearchResult {
  musics: {
    id: number
    name: string
    artist: string
    level: number
    difficulty: 'master'
  }[]
}
