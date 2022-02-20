import { Fragment, FunctionComponent, useEffect } from 'react'

import Link from 'next/link'
import { CreditCardIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/router'

export const Layout: FunctionComponent = props => {
  const { children } = props

  const router = useRouter()

  return (
    <Fragment>
      <div className="mx-auto max-w-3xl mt-12 px-6">
        <header className="flex justify-between items-center mb-8">
          <Link href="/">
            <a>
              <img className="h-8 w-auto" src="/assets/pamuse.svg" />
            </a>
          </Link>
          <div className="border rounded px-2 py-1 flex items-center hover:cursor-pointer">
            <p className="text-gray-700 font-medium mr-2">8594</p>
            <CreditCardIcon className="w-6 h-6 text-gray-700" />
          </div>
        </header>
        <main>{children}</main>
      </div>
      <footer className="flex justify-center py-10">
        <p className="text-gray-500">© 2022 Pradit Amusement</p>
      </footer>
    </Fragment>
  )
}
