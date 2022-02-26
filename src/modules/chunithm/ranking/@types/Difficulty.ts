export interface Difficulty {
  id: number
  key: 'basic' | 'advanced' | 'expert' | 'master'
  name: 'Basic' | 'Advanced' | 'Expert' | 'Master'
  color: {
    primary: string
    secondary: string
    border: string
    ring: string
  }
}
