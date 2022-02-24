import { GetServerSidePropsContext, NextApiRequest } from 'next'

import { parse } from './parse'
import { sessionCookieName } from '../../../constants/sessionCookieName'

export const get = (req: NextApiRequest | GetServerSidePropsContext['req']) => {
  const cookies = parse(req)
  return cookies[sessionCookieName]
}
