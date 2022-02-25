import { GetServerSidePropsContext } from 'next'
import { NextRequest } from 'next/server'

import { getLoginSession } from '../session/getLoginSession'
import { findUser } from './findUser'

export const getApiUserSession = async (
  req: NextRequest | GetServerSidePropsContext['req']
) => {
  try {
    const session = await getLoginSession(req)
    const user = (session && (await findUser(session.username))) ?? null

    return user
  } catch (error) {
    return null
  }
}
