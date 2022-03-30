import { UserAuth } from './db/UserAuth'

export interface UserWithData extends UserAuth {
  card_luid: string | null
  god_mode: number
}
