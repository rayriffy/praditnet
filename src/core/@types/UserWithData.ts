import { UserAuth } from './db/UserAuth'

export interface UserWithData extends UserAuth {
  aimeCard: string | null
  eamuseCard: string | null
  god_mode: number
}
