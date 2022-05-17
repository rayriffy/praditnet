import { Fragment } from 'react'

import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'

interface Props {
  event: {
    id: string
    games: string[]
  }
}

const Page: NextPage<Props> = props => {
  const { event } = props

  return (
    <Fragment>
      <div className="flex -mt-6">
        <p className="uppercase bg-red-500 text-white px-2 py-0.5 text-xs rounded">
          Staff mode
        </p>
      </div>
      <div className="mt-6 space-y-4">
        <h1 className="text-2xl font-bold dark:text-white">Contestants</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {event.games.map(game => (
            <Link
              href={`/event/${event.id}/staff/qualify/contestants/${game}`}
              key={`randomizer-${game}`}
            >
              <a className="bg-white rounded-lg shadow border p-4">
                <img
                  src={`/assets/logo/${game}.png`}
                  className="h-32 w-auto mx-auto"
                />
              </a>
            </Link>
          ))}
        </div>
      </div>
    </Fragment>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { createKnexInstance } = await import(
    '../../../../../../core/services/createKnexInstance'
  )
  const { getApiUserSession } = await import(
    '../../../../../../core/services/authentication/api/getApiUserSession'
  )
  const { getIsEventStaff } = await import(
    '../../../../../../modules/event/home/services/getIsEventStaff'
  )

  const eventId = ctx.params.eventId as string

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
  if (targetEvent === undefined) {
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

  await knex.destroy()
  // permit to page
  return {
    props: {
      event: {
        id: targetEvent.uid,
        games: targetEvent.availableGames.split(',').map(o => o.trim()),
      },
    },
  }
}

export default Page
