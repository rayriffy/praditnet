import { Fragment, useEffect, useState } from 'react'

import { GetServerSideProps, NextPage } from 'next'

import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

import { Input } from '../../../../../modules/event/randomizer/components/input'
import { createApiInstance } from '../../../../../core/services/createApiInstance'
import { MusicList } from '../../../../../modules/event/randomizer/components/musicList'

import { SearchResult } from '../../../../../modules/event/randomizer/@types/SearchResult'

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

    const axios = await createApiInstance(executeRecaptcha('event/random'))

    try {
      const { data: searchResult } = await axios.post('event/random', {
        eventId: event.id,
        gameId: event.game,
        ...options,
      })
      setResult(searchResult.data)
    } catch (e) {
    } finally {
      setProgress(false)
    }
  }

  useEffect(() => {
    if (
      result !== null &&
      document.querySelector('.grecaptcha-badge') !== null
    ) {
      document.querySelector('.grecaptcha-badge').remove()
    }
  }, [result])

  return (
    <Fragment>
      {result !== null ? (
        <MusicList event={event} musics={result.musics} />
      ) : (
        <div className="max-w-3xl mx-auto">
          <div className="mt-6 space-y-4">
            <h1 className="text-2xl font-bold dark:text-white">Randomizer</h1>
            {/* <p className="my-4 p-4 bg-red-100 text-red-800 rounded-lg leading-tight text-sm">{JSON.stringify(props)}</p> */}
            <Input pools={pools} disabled={progress} onRequest={onSearch} />
          </div>
          <p className="mt-2 text-gray-600 text-sm">
            Cards overflow from viewport? Press{' '}
            <span className="font-mono text-xs p-1 bg-gray-100 border-2 rounded">
              Space
            </span>{' '}
            to enable overflow mode
          </p>
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
