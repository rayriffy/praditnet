import { Fragment } from 'react'

import { NextPage } from 'next'
import { AppProps } from 'next/app'
import Head from 'next/head'
import Link from 'next/link'

import { SessionProvider } from "next-auth/react"
import { CreditCardIcon } from '@heroicons/react/solid'

import { Layout } from '../app/components/layout'

import '../styles/tailwind.css'

const NextApp: NextPage<AppProps> = props => {
  const { Component, pageProps: { session, ...pageProps } } = props

  return (
    <SessionProvider session={session}>
      <Head>
        <title>PraditNET</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  )
}

export default NextApp
