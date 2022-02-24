import Iron from '@hapi/iron'
import { NextApiResponse } from 'next'

import { set } from '../cookie/set'
import { maxSessionAge } from '../../../constants/maxSessionAge'

const { PASSPORT_SECRET } = process.env

export const setLoginSession = async (res: NextApiResponse, session) => {
  const createdAt = Date.now()

  const payload = { ...session, createdAt, maxAge: maxSessionAge }
  const token = await Iron.seal(payload, PASSPORT_SECRET, Iron.defaults)

  set(res, token)
}
