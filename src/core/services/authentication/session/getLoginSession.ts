import Iron from '@hapi/iron'
import { GetServerSidePropsContext, NextApiRequest } from 'next'
import { NextRequest } from 'next/server'

import { get } from '../cookie/get'

const { PASSPORT_SECRET } = process.env

interface LoginSession {
  id: number
  uid: string
  username: string
  hash: string
  salt: string
  createdAt: number
  maxAge: number
}

export const getLoginSession = async (
  req: NextApiRequest | GetServerSidePropsContext['req'] | NextRequest
): Promise<LoginSession> => {
  const token = get(req)

  if (!token) return

  const session = await Iron.unseal(token, PASSPORT_SECRET, Iron.defaults)
  const expiresAt = session.createdAt + session.maxAge * 1000

  // Validate the expiration date of the session
  if (Date.now() > expiresAt) {
    throw new Error('session-expired')
  }

  return session
}
