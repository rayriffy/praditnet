import { Fragment } from 'react'

import { NextPage } from 'next'
import { AppProps } from 'next/app'
import Head from 'next/head'

import { Layout } from '../app/components/layout'

import '../styles/tailwind.css'

const NextApp: NextPage<AppProps> = props => {
  const {
    Component,
    pageProps: { session, ...pageProps },
  } = props

  return (
    <Fragment>
      <Head>
        <title>PraditNET</title>
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
