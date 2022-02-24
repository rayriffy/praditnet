import Iron from '@hapi/iron'
import { GetServerSidePropsContext, NextApiRequest } from 'next'

import { get } from '../cookie/get'

const { PASSPORT_SECRET } = process.env

export const getLoginSession = async (
  req: NextApiRequest | GetServerSidePropsContext['req']
) => {
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
