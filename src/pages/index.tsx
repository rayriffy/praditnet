import { GetServerSideProps, NextPage } from 'next'

import { ArrowRightIcon, CreditCardIcon } from '@heroicons/react/solid'

import { UserPreview } from '../modules/home/@types/UserPreview'
import { games } from '../modules/home/constants/games'
import { PreviewCard } from '../modules/home/components/previewCard'

interface Props {
  finale: UserPreview
  chunithm: UserPreview
  ongeki: UserPreview
}

const Page: NextPage<Props> = props => {
  return (
    <div>
      <div className="mx-auto max-w-3xl mt-12 px-6">
        <div className="flex justify-between items-center mb-8">
          <img className="h-8 w-auto" src="/assets/pamuse.svg" />
          <div className="border rounded px-2 py-1 flex items-center hover:cursor-pointer">
            <p className="text-gray-700 font-medium mr-2">8594</p>
            <CreditCardIcon className="w-6 h-6 text-gray-700" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 mt-14">
          {games.map(game => (
            <PreviewCard
              key={`preview-${game.id}`}
              game={game}
              userPreview={props[game.id]}
            />
          ))}
        </div>
      </div>
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

  ctx.res.setHeader(
    'Cache-Control',
    'max-age=300, public'
  )

  return {
    props: {
      finale: finaleUserPreview,
      chunithm: chunithmUserPreview,
      ongeki: ongekiUserPreview,
    },
  }
}

export default Page
