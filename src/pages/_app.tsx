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

  const { events } = useRouter()

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
      </Head>
      <Layout
        aime={pageProps.user === undefined ? undefined : pageProps.user.aime}
        eamuse={
          pageProps.user === undefined ? undefined : pageProps.user.eamuse
        }
      >
        <Component {...pageProps} />
      </Layout>
    </Fragment>
  )
}

export default NextApp
