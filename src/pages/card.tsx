import { useState } from 'react'

import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import dynamic from 'next/dynamic'

import { E } from '../core/components/e'
import { BiTransfer } from 'react-icons/bi'
import { LogoutIcon, PlusIcon } from '@heroicons/react/solid'
import { AimeTransferDialogProps } from '../modules/card/components/aimeTransferDialog'
import { CardTabsProps } from '../modules/card/components/cardTabs'

const TransferDialog = dynamic<AimeTransferDialogProps>(
  () =>
    import('../modules/card/components/aimeTransferDialog').then(
      o => o.TransferDialog
    ),
  { ssr: false }
)

const CardTabs = dynamic<CardTabsProps>(
  () => import('../modules/card/components/cardTabs').then(o => o.CardTabs),
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
  eamuse: {
    cardId: string
    chunkedCardId: string[]
    luid: string | null
    createdAt: string | null
  }
}

const Page: NextPage<Props> = props => {
  const { aime, eamuse } = props
  const { username } = props.userData

  const [open, setOpen] = useState(false)

  return (
    <div>
      <div className="max-w-md mx-auto space-y-4">
        <CardTabs {...{ username, aime, eamuse }} />

        <Link href="/api/authentication/logout">
          <a className="inline-flex w-full justify-center relative items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            <span className="absolute left-4 flex items-center top-0 bottom-0">
              <LogoutIcon className="w-4" />
            </span>
            Logout
          </a>
        </Link>
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
      eamuse: {
        cardId: null,
        chunkedCardId: Array.from({ length: 5 }).map(() => `----`),
        luid: null,
        createdAt: null,
      },
    },
  }
}

export default Page
