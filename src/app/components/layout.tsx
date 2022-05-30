import { FunctionComponent, PropsWithChildren, Fragment } from 'react'

import Link from 'next/link'
import { ArrowRightIcon, CreditCardIcon } from '@heroicons/react/solid'

import { PAmuse } from './pamuse'
import { R } from '../../core/components/r'

interface Props extends PropsWithChildren<{}> {
  aime?: string | null
  eamuse?: string | null
}

export const Layout: FunctionComponent<Props> = props => {
  const { children, aime, eamuse } = props

  return (
    <Fragment>
      <div className="mx-auto max-w-3xl mt-12 px-6">
        <header className="flex justify-between items-center mb-8">
          <div className="flex shrink-0 items-center">
            <Link href="/">
              <a>
                <PAmuse className="h-7 w-auto fill-gray-700" />
              </a>
            </Link>
            <div className="mx-4 h-6 border-l-2 border-gray-300" />
            <a
              href="https://rayriffy.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <R className="h-8 w-auto fill-gray-700" />
            </a>
          </div>
          {(aime !== undefined || eamuse !== undefined) && (
            <div className="flex items-center">
              {aime === null && eamuse === null && (
                <div className="hidden md:flex md:items-center">
                  <p className="text-gray-700">
                    Click here to add your card into account
                  </p>
                  <ArrowRightIcon className="w-4 h-4 mx-2" />
                </div>
              )}
              <Link href="/card">
                <a className="border rounded px-2 py-1 flex items-center hover:cursor-pointer">
                  <p className="text-gray-700 font-medium mr-2">
                    {aime === null && eamuse === null ? (
                      <span className="text-sm">Not set up</span>
                    ) : (
                      (aime ?? eamuse).substring((aime ?? eamuse).length - 4)
                    )}
                  </p>
                  <CreditCardIcon className="w-6 h-6 text-gray-700" />
                </a>
              </Link>
            </div>
          )}
        </header>
        <main>{children}</main>
      </div>
      <footer className="py-10 text-gray-400">
        <p className="text-center text-base">
          Version <b>{process.env.buildNumber}</b>
        </p>
        <p className="text-center text-xs sm:text-sm">
          &copy; 2022 Pradit Amusement
        </p>
      </footer>
    </Fragment>
  )
}
