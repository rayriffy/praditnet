import { parse as parseCookie } from 'cookie'
import { NextRequest } from 'next/server'
import { GetServerSidePropsContext, NextApiRequest } from 'next'

export const parse = (
  req: NextApiRequest | GetServerSidePropsContext['req'] | NextRequest
) => {
  // For API Routes we don't need to parse the cookies.
  if (req.cookies) {
    return req.cookies
  } else {
    // For pages we do need to parse the cookies.
    // @ts-ignore
    const cookie = req.headers?.cookie

    return parseCookie(cookie || '')
  }
}
