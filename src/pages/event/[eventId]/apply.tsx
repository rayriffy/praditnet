import { GetServerSideProps, NextPage } from 'next'
import { useTitle } from '../../../core/services/useTitle'

import { Form } from '../../../modules/event/apply/components/form'

interface Props {
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
}

const Page: NextPage<Props> = props => {
  const { event, musics } = props

  useTitle('Apply')

  return (
    <div>
      <h1 className="font-bold text-3xl my-4">Applying for an event</h1>
      <h2 className="text-2xl font-semibold">Qualification rules</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-lg font-bold">1 Game</h3>
          <p className="text-sm text-gray-700">
            You're only able to apply for 1 game to contest
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-lg font-bold">2 Attempts</h3>
          <p className="text-sm text-gray-700">
            You will have only 2 attmpts to record your best score for each
            tracks
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-lg font-bold">8 Contestants</h3>
          <p className="text-sm text-gray-700">
            Only 8 contestants will be qualified to the main event day
          </p>
        </div>
      </div>
      <h2 className="text-2xl font-semibold my-4">Application form</h2>
      <Form eventId={event.id} musics={musics} />
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
  const { getEventMusics } = await import(
    '../../../modules/event/home/services/getEventMusics'
  )

  const eventId = ctx.params.eventId as string

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

  // redirect to event if already applied
  const existingRegistration = await knex('EventAuditionRecord')
    .where({
      eventId: eventId,
      userId: user.uid,
    })
    .first()

  if (
    existingRegistration !== undefined ||
    dayjs(targetEvent.endAt).isBefore(dayjs())
  ) {
    await knex.destroy()
    return {
      redirect: {
        statusCode: 302,
        destination: `/event/${eventId}`,
      },
    }
  }

  // get musics information
  const fetchedMusics = await getEventMusics(
    eventId,
    knex,
    targetEvent.availableGames.split(',')
  )

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
    },
  }
}

export default Page
