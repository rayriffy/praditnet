import { XCircleIcon } from '@heroicons/react/outline'
import { memo, Fragment } from 'react'
import { useEventRanks } from '../services/useEventRanks'

interface Props {
  eventId: string
  gameId: string
}

export const Leaderboard = memo<Props>(props => {
  const { eventId, gameId } = props

  const {
    loading,
    data: { ranks, columns, updatedAt },
    error,
  } = useEventRanks(eventId, gameId)

  return (
    <Fragment>
      {error ? (
        <div className="mt-12 px-4">
          <XCircleIcon className="w-16 h-16 text-red-500 mx-auto" />
          <h1 className="font-semibold text-gray-900 text-center leading-none mt-4 text-lg">
            Failed to fetch
          </h1>
          <p className="text-sm text-gray-700 text-center">
            Pleae check internet connection, and then try again
          </p>
        </div>
      ) : (
        <Fragment>
          {!loading && (
            <p className="py-0.5">
              <b>Updated at:</b> {updatedAt}
            </p>
          )}
          <div className="overflow-x-scroll shadow ring-1 ring-black ring-opacity-5 rounded-lg mt-4">
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
                  {!loading &&
                    columns.map(column => (
                      <th
                        key={`table-header-${column}`}
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 truncate"
                      >
                        {column}
                      </th>
                    ))}
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {loading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <tr key={`rank-loading-${i}`}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6">
                          <span className="text-gray-500 bg-gray-500 select-none animate-pulse rounded-md px-0.5">
                            1st
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className="text-gray-900 bg-gray-900 select-none animate-pulse rounded-md px-0.5">
                            wwwwwwww
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className="text-gray-500 bg-gray-500 select-none animate-pulse rounded-md px-0.5">
                            100.1234
                          </span>
                        </td>
                      </tr>
                    ))
                  : ranks.map((rank, i) => (
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
                        {!loading &&
                          columns.map(column => (
                            <td
                              key={`table-body-${column}`}
                              className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                            >
                              {rank.score[column]}
                            </td>
                          ))}
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-700">
                          {rank.sums}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </Fragment>
      )}
    </Fragment>
  )
})
