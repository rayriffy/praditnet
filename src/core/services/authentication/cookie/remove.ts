import { serialize } from 'cookie'
import { NextApiResponse } from 'next'

import { sessionCookieName } from '../../../constants/sessionCookieName'

export const remove = (res: NextApiResponse) => {
  const cookie = serialize(sessionCookieName, '', {
    maxAge: -1,
    path: '/',
  })

  res.setHeader('Set-Cookie', cookie)
}
