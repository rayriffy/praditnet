import { Fragment } from 'react'

import { NextPage } from 'next'
import { AppProps } from 'next/app'
import Head from 'next/head'

import '../styles/tailwind.css'

const NextApp: NextPage<AppProps> = props => {
  const { Component, pageProps } = props

  return (
    <Fragment>
      <Head>
        <title>PraditNET</title>
      </Head>
      <Component {...pageProps} />
      <footer className="flex justify-center mt-10">
        <p className="text-gray-500">© 2022 Pradit Amusement</p>
      </footer>
    </Fragment>
  )
}

export default NextApp
