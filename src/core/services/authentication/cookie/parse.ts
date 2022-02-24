import { parse as parseCookie } from 'cookie'
import { GetServerSidePropsContext, NextApiRequest } from 'next'

export const parse = (
  req: NextApiRequest | GetServerSidePropsContext['req']
) => {
  // For API Routes we don't need to parse the cookies.
  if (req.cookies) return req.cookies

  // For pages we do need to parse the cookies.
  const cookie = req.headers?.cookie

  return parseCookie(cookie || '')
}
