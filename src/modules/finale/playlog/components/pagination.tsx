import { Fragment, memo, useMemo } from 'react'

import Link from 'next/link'

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/solid'

interface Props {
  current: number
  max: number
}

export const Pagination = memo<Props>(props => {
  const { current, max } = props

  const paginatedLeft = useMemo(
    () => (
      <Fragment>
        <ArrowLeftIcon className="mr-2 w-5 h-5" />
        Previous
      </Fragment>
    ),
    []
  )

  const paginatedRight = useMemo(
    () => (
      <Fragment>
        Next
        <ArrowRightIcon className="ml-2 w-5 h-5" />
      </Fragment>
    ),
    []
  )

  return (
    <div className="flex justify-center mt-8">
      {current === 1 ? (
        <div className="inline-flex items-center py-2 px-4 mr-3 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-neutral-600 dark:border-white dark:text-gray-200 dark:hover:bg-neutral-700 dark:hover:text-white transition cursor-not-allowed">
          {paginatedLeft}
        </div>
      ) : (
        <Link
          href={`/finale/playlog${current - 1 !== 1 ? `/${current - 1}` : ''}`}
        >
          <a className="inline-flex items-center py-2 px-4 mr-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-neutral-700 dark:border-white dark:text-gray-200 dark:hover:bg-neutral-600 dark:hover:text-white transition">
            {paginatedLeft}
          </a>
        </Link>
      )}
      {current + 1 === max ? (
        <div className="inline-flex items-center py-2 px-4 mr-3 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-neutral-600 dark:border-white dark:text-gray-200 dark:hover:bg-neutral-700 dark:hover:text-white transition cursor-not-allowed">
          {paginatedRight}
        </div>
      ) : (
        <Link href={`/finale/playlog/${current + 1}`}>
          <a className="inline-flex items-center py-2 px-4 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-neutral-700 dark:border-white dark:text-gray-200 dark:hover:bg-neutral-600 dark:hover:text-white transition">
            {paginatedRight}
          </a>
        </Link>
      )}
    </div>
  )
})
