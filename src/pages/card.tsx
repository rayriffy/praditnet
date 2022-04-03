import { useState } from 'react'

import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import dynamic from 'next/dynamic'

import { E } from '../core/components/e'
import { BiTransfer } from 'react-icons/bi'
import { LogoutIcon, PlusIcon } from '@heroicons/react/solid'
import { TransferDialogProps } from '../modules/card/components/transferDialog'

const TransferDialog = dynamic<TransferDialogProps>(
  () =>
    import('../modules/card/components/transferDialog').then(
      o => o.TransferDialog
    ),
  { ssr: false }
)

interface Props {
  userData: {
    username: string
  }
  aime: {
    cardId: string
    chunkedCardId: string[]
    luid: string | null
    createdAt: string | null
  }
  // eamuse: {
  //   cardId: string
  //   chunkedCardId: string[]
  //   luid: string | null
  //   createdAt: string | null
  // }
}

const Page: NextPage<Props> = props => {
  const { aime } = props
  const { username } = props.userData

  const [open, setOpen] = useState(false)

  return (
    <div>
      <div className="max-w-md mx-auto space-y-8">
        <div className="w-full aspect-[3.37/2.125] overflow-hidden bg-gradient-to-tr from-blue-50 to-gray-50 rounded-xl transition duration-300 hover:shadow-2xl hover:shadow-blue-50 relative hover:scale-105">
          <E className="absolute -top-24 right-10 w-5/6" />
          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
            {aime.cardId !== null && (
              <p className="font-mono text-gray-700 text-xs">
                Owned by {username}
              </p>
            )}
            <p className="font-mono text-gray-800 text-lg sm:text-xl">
              {aime.chunkedCardId.join(' ')}
            </p>
            <p className="font-mono text-gray-700 text-sm">
              Created at: {aime.createdAt ?? '--/--'}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            className="inline-flex w-full justify-center relative items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span className="absolute left-4 flex items-center top-0 bottom-0">
              {aime.cardId !== null ? (
                <BiTransfer />
              ) : (
                <PlusIcon className="w-4" />
              )}
            </span>
            {aime.cardId !== null ? 'Transfer card' : 'Bind card'}
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
      <TransferDialog show={open} setShow={setOpen} cardId={aime.cardId} />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { default: chunk } = await import('lodash/chunk')
  const { getApiUserSession } = await import(
    '../core/services/authentication/api/getApiUserSession'
  )
  const { getCardData } = await import('../modules/card/services/getCardData')

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

  const cardData = await getCardData(user.aimeCard)

  return {
    props: {
      userData: {
        username: user.username,
      },
      aime: {
        ...cardData,
        cardId: user.aimeCard,
        chunkedCardId:
          user.aimeCard === null
            ? Array.from({ length: 5 }).map(() => `----`)
            : chunk(user.aimeCard, 4).map(chunk => chunk.join('')),
      },
    },
  }
}

export default Page
