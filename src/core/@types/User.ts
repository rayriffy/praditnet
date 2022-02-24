export interface User {
  id?: number
  uid: string
  username: string
  hash?: string
  salt?: string
  createdAt: Date
}
