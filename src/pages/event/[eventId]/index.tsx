import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'

import dayjs from 'dayjs'

import { Image } from '../../../core/components/image'
import { Preview } from '../../../modules/event/home/components/preview'
import { Entry } from '../../../modules/event/home/components/entry'
import { useTitle } from '../../../core/services/useTitle'
import { useMemo } from 'react'

export interface Props {
  user: {
    id: string
  }
  event: {
    id: string
    name: string
    startAt: string
    endAt: string
    url: string
  }
  musics: {
    [key: string]: {
      id: number
      name: string
      artist: string
      level: string
      difficulty: number
    }[]
  }
  isStaff: boolean
  ranking: string
  entry: {
    game: 'maimai' | 'chunithm'
    inGameName: string
    remainingAttempts: number
    attemptLog: [number, number, string][] // [musicId, score, metadata]
  } | null
}

const Page: NextPage<Props> = props => {
  const { user, event, musics, entry, isStaff, ranking } = props

  useTitle(event.name)

  const isEventEnded = useMemo(() => dayjs(event.endAt).isBefore(dayjs()), [])

  return (
    <div className="space-y-4">
      <div className="flex justify-center items-center">
        <div className="bg-gradient-to-tr from-zinc-700 to-stone-800 p-4 rounded-xl">
          <div className="flex w-60">
            <Image
              src={`https://cdn.pradit.net/event/${event.id}.png`}
              width={745}
              height={623}
            />
          </div>
        </div>
      </div>
      {isStaff ? (
        <div className="border-[3px] border-red-200 rounded-md relative">
          <span className="ml-3 bg-red-200 px-2 py-1 text-sm uppercase leading-none rounded-b font-bold text-gray-700">
            Staff Mode
          </span>
          <div className="p-2 flex flex-wrap">
            <Link href={`/event/${event.id}/staff/qualify/submission`}>
              <a className="m-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Submission
              </a>
            </Link>
            <Link href={`/event/${event.id}/staff/qualify/contestants`}>
              <a className="m-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Contestants
              </a>
            </Link>
            <Link href={`/event/${event.id}/staff/randomizer`}>
              <a className="m-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Randomizer
              </a>
            </Link>
          </div>
        </div>
      ) : null}
      <div className="space-x-4 flex justify-center">
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Event details
        </a>
        <Link href={`/event/${event.id}/leaderboard`}>
          <a className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Leaderboard
          </a>
        </Link>
      </div>
      {entry === null ? (
        <Preview
          eventId={event.id}
          musics={musics}
          isEventEnded={isEventEnded}
        />
      ) : (
        <Entry {...{ user, entry, musics, event, ranking }} />
      )}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { default: dayjs } = await import('dayjs')
  const { createKnexInstance } = await import(
    '../../../core/services/createKnexInstance'
  )
  const { getApiUserSession } = await import(
    '../../../core/services/authentication/api/getApiUserSession'
  )
  const { getIsEventStaff } = await import(
    '../../../modules/event/home/services/getIsEventStaff'
  )
  const { getEventEntry } = await import(
    '../../../modules/event/home/services/getEventEntry'
  )
  const { getEventMusics } = await import(
    '../../../modules/event/home/services/getEventMusics'
  )
  const { getEventRanking } = await import(
    '../../../modules/event/home/services/getEventRanking'
  )

  const eventId = ctx.params.eventId as string

  const user = await getApiUserSession(ctx.req)

  const knex = createKnexInstance('praditnet')

  // get event information
  const targetEvent = await knex('Event')
    .where({
      uid: eventId,
    })
    .first()

  if (targetEvent === undefined) {
    await knex.destroy()

    return {
      notFound: true,
    }
  }

  const [fetchedMusics, entry, isStaff, ranking] = await Promise.all([
    getEventMusics(eventId, knex, targetEvent.availableGames.split(',')),
    getEventEntry(eventId, knex, user),
    getIsEventStaff(eventId, knex, user?.uid ?? 'undefined mock user id'),
    getEventRanking(eventId, knex, user?.uid ?? 'undefined mock user id'),
  ])

  await knex.destroy()

  return {
    props: {
      user: {
        id: user?.uid ?? '',
      },
      ranking,
      event: {
        id: targetEvent.uid,
        name: targetEvent.name,
        startAt: dayjs(targetEvent.startAt).format('DD MMM YYYY'),
        endAt: dayjs(targetEvent.startAt).format('DD MMM YYYY'),
        url: targetEvent.eventInfoUrl,
      },
      musics: Object.fromEntries(fetchedMusics),
      isStaff,
      entry,
    },
  }
}

export default Page
