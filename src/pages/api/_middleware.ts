import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (
    process.env.NODE_ENV !== 'development' &&
    !(req.headers.get('referer') ?? '').startsWith('https://pradit.net')
  ) {
    return new Response('Forbidden', { status: 403 })
  } else {
    return NextResponse.next()
  }
}
