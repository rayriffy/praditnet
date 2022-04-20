import { Fragment, useState } from 'react'

import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'

import axios from 'axios'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

import { Image } from '../../../../../core/components/image'
import { Input } from '../../../../../modules/event/randomizer/components/input'
import { SearchResult } from '../../../../../modules/event/randomizer/@types/SearchResult'
import { DifficultyBlock } from '../../../../../core/components/difficultyBlock'
import { RenderedMusic } from '../../../../../modules/event/randomizer/components/renderedMusic'

interface Props {
  event: {
    id: string
    game: string
  }
  pools: {
    id: string
    name: string
  }[]
}

const Page: NextPage<Props> = props => {
  const { event, pools } = props

  const [progress, setProgress] = useState(false)
  const [result, setResult] = useState<SearchResult | null>(null)

  const { executeRecaptcha } = useGoogleReCaptcha()

  const onSearch = async (options: { pools: string[]; amount: number }) => {
    setProgress(true)
    setResult(null)

    const token = await executeRecaptcha('event/random')

    try {
      const { data: searchResult } = await axios.post(
        '/api/event/random',
        {
          eventId: event.id,
          gameId: event.game,
          ...options,
        },
        {
          headers: {
            'X-PraditNET-Capcha': token,
          },
        }
      )
      setResult(searchResult.data)
    } catch (e) {
    } finally {
      setProgress(false)
    }
  }

  return (
    <Fragment>
      <div className="flex -mt-6">
        <p className="uppercase bg-red-500 text-white px-2 py-0.5 text-xs rounded">
          Staff mode
        </p>
      </div>
      <div className="mt-6 space-y-4">
        <h1 className="text-2xl font-bold dark:text-white">Randomizer</h1>
        {/* <p className="my-4 p-4 bg-red-100 text-red-800 rounded-lg leading-tight text-sm">{JSON.stringify(props)}</p> */}
        <Input pools={pools} disabled={progress} onRequest={onSearch} />
      </div>
      {result !== null && (
        <div className="mt-6 sm:p-4 lg:-mx-32 xl:-mx-40 2xl:-mx-48 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 items-center">
          {result.musics.map(music => (
            <RenderedMusic
              event={event}
              music={music}
              key={`randomized-${event.game}-${music.id}`}
            />
          ))}
        </div>
      )}
    </Fragment>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { default: sortBy } = await import('lodash/sortBy')

  const { createKnexInstance } = await import(
    '../../../../../core/services/createKnexInstance'
  )
  const { getApiUserSession } = await import(
    '../../../../../core/services/authentication/api/getApiUserSession'
  )
  const { getIsEventStaff } = await import(
    '../../../../../modules/event/home/services/getIsEventStaff'
  )

  const eventId = ctx.params.eventId as string
  const gameId = ctx.params.gameId as string

  // check if auth
  const user = await getApiUserSession(ctx.req)
  if (user === null || user === undefined) {
    return {
      redirect: {
        statusCode: 302,
        destination: '/login',
      },
    }
  }

  const knex = createKnexInstance('praditnet')

  // if no event then 404
  const targetEvent = await knex('Event')
    .where({
      uid: eventId,
    })
    .first()
  if (
    targetEvent === undefined ||
    !targetEvent.availableGames.includes(gameId)
  ) {
    await knex.destroy()
    return {
      notFound: true,
    }
  }

  // check is staff, if not then redirect ro event
  const isStaff = await getIsEventStaff(eventId, knex, user.uid)
  if (!isStaff) {
    await knex.destroy()
    return {
      redirect: {
        statusCode: 302,
        destination: `/event/${eventId}`,
      },
    }
  }

  // fetch for event pools
  const pools = await knex('EventPool').where({
    eventId,
    gameId,
  })

  await knex.destroy()
  // permit to page
  return {
    props: {
      event: {
        id: targetEvent.uid,
        game: gameId,
      },
      pools: sortBy(pools, ['order']).map(pool => ({
        id: pool.uid,
        name: pool.title,
      })),
    },
  }
}

export default Page
