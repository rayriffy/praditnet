import { Fragment, FunctionComponent, useEffect } from 'react'

import Link from 'next/link'
import { ArrowRightIcon, CreditCardIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/router'

import { PAmuse } from './pamuse'

interface Props {
  cardId?: string | null
}

export const Layout: FunctionComponent<Props> = props => {
  const { children, cardId } = props

  const router = useRouter()

  console.log({ cardId })

  return (
    <Fragment>
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
                    Click here to add your card to your account
                  </p>
                  <ArrowRightIcon className="w-4 h-4 mx-2" />
                </div>
              )}
              <Link href="/card">
                <a className="border rounded px-2 py-1 flex items-center hover:cursor-pointer dark:bg-gray-800">
                  <p className="text-gray-700 dark:text-gray-100 font-medium mr-2">
                    {cardId === null ? (
                      <span className="text-sm">Not setted up</span>
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
      <footer className="flex justify-center py-10">
        <p className="text-gray-500">© 2022 Pradit Amusement</p>
      </footer>
    </Fragment>
  )
}
