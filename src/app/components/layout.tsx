import { FunctionComponent } from 'react'

import Link from 'next/link'
import { ArrowRightIcon, CreditCardIcon } from '@heroicons/react/solid'

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

import { PAmuse } from './pamuse'

interface Props {
  cardId?: string | null
}

export const Layout: FunctionComponent<Props> = props => {
  const { children, cardId } = props

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.RECAPCHA_SITE_KEY}
      scriptProps={{
        async: true,
        appendTo: 'body',
      }}
    >
      <div className="mx-auto max-w-3xl mt-12 px-6">
        <header className="flex justify-between items-center mb-8">
          <Link href="/">
            <a className="mr-4">
              <PAmuse />
            </a>
          </Link>
          {cardId !== undefined && (
            <div className="flex items-center">
              {cardId === null && (
                <div className="hidden md:flex md:items-center">
                  <p className="text-gray-700">
                    Click here to add your card into account
                  </p>
                  <ArrowRightIcon className="w-4 h-4 mx-2" />
                </div>
              )}
              <Link href="/card">
                <a className="border rounded px-2 py-1 flex items-center hover:cursor-pointer dark:bg-neutral-700">
                  <p className="text-gray-700 dark:text-gray-100 font-medium mr-2">
                    {cardId === null ? (
                      <span className="text-sm">Not set up</span>
                    ) : (
                      cardId.substring(cardId.length - 4)
                    )}
                  </p>
                  <CreditCardIcon className="w-6 h-6 text-gray-700 dark:text-gray-100" />
                </a>
              </Link>
            </div>
          )}
        </header>
        <main>{children}</main>
      </div>
      <footer className="py-10 text-gray-400 dark:text-gray-300">
        <p className="text-center text-base">
          Version <b>{process.env.buildNumber}</b>
        </p>
        <p className="text-center text-xs sm:text-sm">
          &copy; 2022 Pradit Amusement
        </p>
      </footer>
    </GoogleReCaptchaProvider>
  )
}
