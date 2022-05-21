import { useEffect } from 'react'

import { NextPage } from 'next'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'

import NProgress from 'nprogress'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

import { HeadTitle } from '../core/components/headTitle'
import { Layout } from '../app/components/layout'
import { TitleProvider } from '../app/components/titleProvider'

import '../styles/nprogress.css'
import '../styles/tailwind.css'

const NextApp: NextPage<AppProps> = props => {
  const {
    Component,
    pageProps: { session, ...pageProps },
  } = props

  const { events, pathname } = useRouter()

  const routeChangeStart = () => {
    NProgress.configure({ minimum: 0.3 })
    NProgress.start()
  }

  const routeChangeEnd = () => {
    NProgress.done()
  }

  useEffect(() => {
    events.on('routeChangeStart', routeChangeStart)
    events.on('routeChangeComplete', routeChangeEnd)
    events.on('routeChangeError', routeChangeEnd)

    return () => {
      events.off('routeChangeStart', routeChangeStart)
      events.off('routeChangeComplete', routeChangeEnd)
      events.off('routeChangeError', routeChangeEnd)
    }
  }, [])

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.RECAPCHA_SITE_KEY}
      scriptProps={{
        async: true,
        appendTo: 'body',
      }}
    >
      <TitleProvider>
        <HeadTitle />
        {[
          '/event/[eventId]/staff/randomizer/[gameId]',
          '/event/[eventId]/internal/bingo/[gameId]',
        ].includes(pathname) ? (
          <Component {...pageProps} />
        ) : (
          <Layout
            aime={
              pageProps.user === undefined ? undefined : pageProps.user.aime
            }
            eamuse={
              pageProps.user === undefined ? undefined : pageProps.user.eamuse
            }
          >
            <Component {...pageProps} />
          </Layout>
        )}
      </TitleProvider>
    </GoogleReCaptchaProvider>
  )
}

export default NextApp
