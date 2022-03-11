import { Fragment, useEffect } from 'react'

import { NextPage } from 'next'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'

import NProgress from 'nprogress'

import { Layout } from '../app/components/layout'

import '../styles/nprogress.css'
import '../styles/tailwind.css'

const NextApp: NextPage<AppProps> = props => {
  const {
    Component,
    pageProps: { session, ...pageProps },
  } = props

  const { asPath, push, events } = useRouter()

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
    <Fragment>
      <Head>
        <title>PraditNET</title>
        <link
          key="favicon-apple"
          rel="apple-touch-icon"
          sizes="180x180"
          href="/assets/icons/apple-touch-icon.png"
        />
        <link
          key="favicon-32"
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/assets/icons/favicon-32x32.png"
        />
        <link
          key="favicon-16"
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/assets/icons/favicon-16x16.png"
        />
        <link key="manifest-json" rel="manifest" href={`/manifest-en.json`} />
        <link
          key="manifest-mask-icon"
          rel="mask-icon"
          href="/safari-pinned-tab.svg"
          color="#4b6fff"
        />
        <meta
          key="manifest-apple-title"
          name="apple-mobile-web-app-title"
          content="Mirai"
        />
        <meta
          key="manifest-apple-name"
          name="application-name"
          content="Mirai"
        />
        <meta
          key="manifest-ms-tile"
          name="msapplication-TileColor"
          content="#ffffff"
        />
        <meta key="manifest-theme" name="theme-color" content="#ffffff" />
      </Head>
      <Layout
        cardId={
          pageProps.user === undefined ? undefined : pageProps.user.cardId
        }
      >
        <Component {...pageProps} />
      </Layout>
    </Fragment>
  )
}

export default NextApp
