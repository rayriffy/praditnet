import { Fragment } from 'react'

import { GetServerSideProps, NextPage } from 'next'

interface Props {
  ranks: {
    order: string
    id: string
    name: string
    score: string
    attemptedAt: string
  }[]
}

const Page: NextPage<Props> = props => {
  const { ranks } = props

  return (
    <Fragment>
      <div className="flex -mt-6">
        <p className="uppercase bg-red-500 text-white px-2 py-0.5 text-xs rounded">
          Staff mode
        </p>
      </div>
      <div className="mt-6 space-y-4">
        <h1 className="text-2xl font-bold dark:text-white">Leaderboard</h1>
      </div>

      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg mt-4">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
              >
                Order
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Score
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {ranks.map((rank, i) => (
              <tr
                key={`rank-${rank.id}`}
                className={i % 2 === 0 ? undefined : 'bg-gray-50'}
              >
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-6">
                  {rank.order}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                  {rank.name}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {rank.score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
  const { getGameEventRanking } = await import(
    '../../../../../../core/services/getGameEventRanking'
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
  const ranks = await getGameEventRanking(eventId, gameId, knex)

  await knex.destroy()

  const stringifyOrder = (order: number) =>
    ['st', 'nd', 'rd'][((((order + 90) % 100) - 10) % 10) - 1] || 'th'

  // permit to page
  return {
    props: {
      ranks: ranks.map((rank, i) => ({
        ...rank,
        order: `${i + 1}${stringifyOrder(i + 1)}`,
        score:
          gameId === 'maimai'
            ? `${rank.score.toFixed(4)}%`
            : rank.score.toLocaleString(),
      })),
    },
  }
}

export default Page
