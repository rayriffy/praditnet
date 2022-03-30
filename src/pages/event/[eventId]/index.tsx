import { useEffect } from 'react'

import { GetServerSideProps, NextPage } from 'next'

import { Image } from '../../../core/components/image'
import { Preview } from '../../../modules/event/home/components/preview'
import { Entry } from '../../../modules/event/home/components/entry'

export interface Props {
  event: {
    id: string
    name: string
    startAt: string
    endAt: string
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
  entry: {
    game: 'maimai' | 'chunithm'
    inGameName: string
    remainingAttempts: number
    attemptLog: [number, number][] // [musicId, score]
  } | null
}

const Page: NextPage<Props> = props => {
  const { event, musics, entry } = props

  useEffect(() => {
    console.log(props)
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex justify-center items-center">
        <div className="bg-gradient-to-tr from-zinc-700 to-stone-800 p-4 rounded-xl">
          <div className="flex w-60">
            <Image
              src={`https://praditnet-cdn.rayriffy.com/event/${event.id}.png`}
              width={745}
              height={623}
            />
          </div>
        </div>
      </div>
      {entry === null ? (
        <Preview eventId={event.id} musics={musics} />
      ) : (
        <Entry {...{ entry, musics }} />
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

  const [fetchedMusics, entry, isStaff] = await Promise.all([
    getEventMusics(eventId, knex, targetEvent.availableGames.split(',')),
    getEventEntry(eventId, knex, user),
    getIsEventStaff(eventId, knex, user.uid),
  ])

  await knex.destroy()

  return {
    props: {
      event: {
        id: targetEvent.uid,
        name: targetEvent.name,
        startAt: dayjs(targetEvent.startAt).format('DD MMM YYYY'),
        endAt: dayjs(targetEvent.startAt).format('DD MMM YYYY'),
      },
      musics: Object.fromEntries(fetchedMusics),
      isStaff,
      entry,
    },
  }
}

export default Page
