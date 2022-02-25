import { Fragment } from 'react'

import { GetServerSideProps, NextPage } from 'next'

import { BiTransfer } from 'react-icons/bi'
import { LogoutIcon } from '@heroicons/react/solid'

import { AppProps } from '../app/@types/AppProps'
import Link from 'next/link'

interface Props {
  userData: {
    cardId: string
    chunkedCardId: string[]
  }
}

const Page: NextPage<Props> = props => {
  const { cardId, chunkedCardId } = props.userData

  return (
    <div>
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-full aspect-[3.37/2.125] bg-gradient-to-tr from-blue-50 to-gray-50 rounded-xl transition duration-300 hover:shadow-2xl hover:shadow-blue-50 relative hover:scale-105">
          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
            <p className="font-mono text-gray-700 text-lg sm:text-xl">
              {chunkedCardId.join(' ')}
            </p>
            <p className="font-mono text-gray-700 text-sm">Created at: 02/22</p>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex w-full justify-center relative items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <span className="absolute left-4 flex items-center top-0 bottom-0">
            <BiTransfer />
          </span>
          Transfer card
        </button>
        <Link href="/api/authentication/logout">
          <a className="inline-flex w-full justify-center relative items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            <span className="absolute left-4 flex items-center top-0 bottom-0">
              <LogoutIcon className="w-4" />
            </span>
            Logout
          </a>
        </Link>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { default: chunk } = await import('lodash/chunk')
  const { getApiUserSession } = await import(
    '../core/services/authentication/api/getApiUserSession'
  )

  // check for user session
  const user = await getApiUserSession(ctx.req)

  if (user === null || user === undefined) {
    return {
      redirect: {
        statusCode: 302,
        destination: '/login',
      },
    }
  }

  return {
    props: {
      userData: {
        cardId: user.card_luid,
        chunkedCardId: chunk(user.card_luid, 4).map(chunk => chunk.join('')),
      },
    },
  }
}

export default Page
