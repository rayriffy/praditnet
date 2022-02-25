import { Fragment, useEffect } from 'react'

import { GetServerSideProps, NextPage } from 'next'

import { ArrowRightIcon, CreditCardIcon } from '@heroicons/react/solid'

import { games } from '../modules/home/constants/games'
import { PreviewCard } from '../modules/home/components/previewCard'

import { UserPreview } from '../modules/home/@types/UserPreview'
import { AppProps } from '../app/@types/AppProps'

interface Props extends AppProps {
  finale: UserPreview
  chunithm: UserPreview
  ongeki: UserPreview
}

const Page: NextPage<Props> = props => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 mt-14">
      {games.map(game => (
        <PreviewCard
          key={`preview-${game.id}`}
          game={game}
          userPreview={props[game.id]}
        />
      ))}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { getFinaleUserPreview } = await import(
    '../modules/home/services/getFinaleUserPreview'
  )
  const { getChunithmUserPreview } = await import(
    '../modules/home/services/getChunithmUserPreview'
  )
  const { getOngekiUserPreview } = await import(
    '../modules/home/services/getOngekiUserPreview'
  )
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
  } else {
    const finaleUserPreview = await getFinaleUserPreview(user.card_luid ?? '')
    const chunithmUserPreview = await getChunithmUserPreview(
      user.card_luid ?? ''
    )
    const ongekiUserPreview = await getOngekiUserPreview(user.card_luid ?? '')

    return {
      props: {
        user: {
          cardId: user.card_luid,
        },
        finale: finaleUserPreview,
        chunithm: chunithmUserPreview,
        ongeki: ongekiUserPreview,
      },
    }
  }
}

export default Page
