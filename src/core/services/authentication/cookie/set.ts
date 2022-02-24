import { serialize } from 'cookie'
import { NextApiResponse } from 'next'

import { maxSessionAge } from '../../../constants/maxSessionAge'
import { sessionCookieName } from '../../../constants/sessionCookieName'

export const set = (res: NextApiResponse, token) => {
  const cookie = serialize(sessionCookieName, token, {
    maxAge: maxSessionAge,
    expires: new Date(Date.now() + maxSessionAge * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  })

  res.setHeader('Set-Cookie', cookie)
}
