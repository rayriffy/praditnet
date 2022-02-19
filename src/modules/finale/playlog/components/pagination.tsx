import { memo } from 'react'

import {
  ArrowLeftIcon,
  ArrowRightIcon,
} from '@heroicons/react/solid'

interface Props {
  current: number
  max: number
}

export const Pagination = memo<Props>(props => {
  const { current, max } = props

  return (
    <div className="flex justify-center mt-8">
      <a
        href="#"
        className="inline-flex items-center py-2 px-4 mr-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition"
      >
        <ArrowLeftIcon className="mr-2 w-5 h-5" />
        Previous
      </a>
      <a
        href="#"
        className="inline-flex items-center py-2 px-4 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition"
      >
        Next
        <ArrowRightIcon className="ml-2 w-5 h-5" />
      </a>
    </div>
  )
})
