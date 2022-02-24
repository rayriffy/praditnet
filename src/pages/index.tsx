import { Fragment, useEffect } from 'react'

import { GetServerSideProps, NextPage } from 'next'

import { ArrowRightIcon, CreditCardIcon } from '@heroicons/react/solid'

import { games } from '../modules/home/constants/games'
import { PreviewCard } from '../modules/home/components/previewCard'

import { UserPreview } from '../modules/home/@types/UserPreview'

interface Props {
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

  const finaleUserPreview = await getFinaleUserPreview()
  const chunithmUserPreview = await getChunithmUserPreview()
  const ongekiUserPreview = await getOngekiUserPreview()

  return {
    props: {
      finale: finaleUserPreview,
      chunithm: chunithmUserPreview,
      ongeki: ongekiUserPreview,
    },
  }
}

export default Page
