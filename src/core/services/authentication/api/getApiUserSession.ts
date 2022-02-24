import { GetServerSidePropsContext } from 'next'
import { getLoginSession } from '../session/getLoginSession'
import { findUser } from '../user/findUser'

export const getApiUserSession = async (
  req: GetServerSidePropsContext['req']
) => {
  try {
    const session = await getLoginSession(req)
    const user = (session && (await findUser(session))) ?? null

    return user
  } catch (error) {
    return null
  }
}
