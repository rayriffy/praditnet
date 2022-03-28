import { GetServerSideProps, NextPage } from 'next'

import Link from 'next/link'

import { games } from '../modules/home/constants/games'
import { PreviewCard } from '../modules/home/components/previewCard'

import { UserPreview } from '../modules/home/@types/UserPreview'
import { AppProps } from '../app/@types/AppProps'
import { Fragment } from 'react'
import dayjs from 'dayjs'

interface Props extends AppProps {
  events: {
    id: string
    name: string
    startAt: string
    endAt: string
  }[]
  finale: UserPreview
  chunithm: UserPreview
  ongeki: UserPreview
}

const Page: NextPage<Props> = props => {
  return (
    <Fragment>
      <div className="space-y-4">
        {props.events.map(event => (
          // <Link key={`event-${event.id}`} href={`/event/${event.id}`}>
          <div className="w-full bg-gradient-to-tr from-zinc-700 to-stone-800 transition duration-[400ms] shadow-none hover:shadow-lg hover:shadow-stone-600 hover:scale-105 rounded-xl py-4 flex justify-center relative text-white hover:cursor-not-allowed grayscale">
            <img
              src={`/assets/event/${event.id}.png`}
              className="w-40 h-auto"
            />
            <div className="absolute right-1 bottom-4 text-sm">
              <p>Coming soon...</p>
            </div>
          </div>
          // </Link>
        ))}
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
    </Fragment>
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
  const { getActiveEvents } = await import(
    '../modules/home/services/getActiveEvents'
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
    const events = await getActiveEvents()

    return {
      props: {
        user: {
          cardId: user.card_luid,
        },
        events: events.map(event => ({
          ...event,
          startAt: dayjs(event.startAt).format('DD MMM'),
          endAt: dayjs(event.endAt).format('DD MMM'),
        })),
        finale: finaleUserPreview,
        chunithm: chunithmUserPreview,
        ongeki: ongekiUserPreview,
      },
    }
  }
}

export default Page
