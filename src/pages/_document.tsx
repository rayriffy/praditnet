import { NextPage } from 'next'
import { Html, Head, Main, NextScript } from 'next/document'

import { Partytown } from '@builder.io/partytown/react'

const Document: NextPage = () => {
  return (
    <Html>
      <Head>
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
        <link key="manifest-json" rel="manifest" href="/manifest-en.json" />
        <link
          key="manifest-mask-icon"
          rel="mask-icon"
          href="/safari-pinned-tab.svg"
          color="#4b6fff"
        />
        <meta
          key="manifest-apple-title"
          name="apple-mobile-web-app-title"
          content="PraditNET"
        />
        <meta
          key="manifest-apple-name"
          name="application-name"
          content="PraditNET"
        />
        <meta
          key="manifest-ms-tile"
          name="msapplication-TileColor"
          content="#ffffff"
        />
        <meta key="manifest-theme" name="theme-color" content="#ffffff" />

        <link rel="dns-prefetch" href="https://cdn-optimizer.pradit.net" />
        <link rel="preconnect" href="https://cdn-optimizer.pradit.net" />

        <Partytown forward={['dataLayer.push']} />

        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-D4SJ07XWZS"
          type="text/partytown"
        ></script>
        <script
          type="text/partytown"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
    
              gtag('config', 'G-D4SJ07XWZS');
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document
