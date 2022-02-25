import { GetServerSidePropsContext, NextApiRequest } from 'next'
import { NextRequest } from 'next/server'

import { parse } from './parse'
import { sessionCookieName } from '../../../constants/sessionCookieName'

export const get = (
  req: NextApiRequest | GetServerSidePropsContext['req'] | NextRequest
) => {
  const cookies = parse(req)
  return cookies[sessionCookieName]
}
