import { Fragment, FunctionComponent, memo, useMemo } from 'react'

import Link from 'next/link'

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/solid'
import { classNames } from '../services/classNames'

interface Props {
  urlPrefix: string
  current: number
  max: number
  firstLast?: boolean
}

const DisabledButton: FunctionComponent = props => (
  <div
    className="inline-flex items-center py-2 px-4 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-neutral-600 dark:border-white dark:text-gray-200 dark:hover:bg-neutral-700 dark:hover:text-white transition cursor-not-allowed"
    {...props}
  />
)

const LinkedButton: FunctionComponent<{ href: string }> = ({
  href,
  ...props
}) => (
  <Link href={href}>
    <a
      className="inline-flex items-center py-2 px-4 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-neutral-700 dark:border-white dark:text-gray-200 dark:hover:bg-neutral-600 dark:hover:text-white transition"
      {...props}
    />
  </Link>
)

const Button: FunctionComponent<{ disabled: boolean; href: string }> = ({
  disabled,
  href,
  ...props
}) =>
  disabled ? (
    <DisabledButton {...props} />
  ) : (
    <LinkedButton href={href} {...props} />
  )

export const Pagination = memo<Props>(props => {
  const { current, max, urlPrefix, firstLast = false } = props

  return (
    <div
      className={classNames(
        firstLast ? 'flex-col space-y-2 sm:flex-row' : '',
        'flex justify-center items-center mt-8 space-x-2'
      )}
    >
      <div className="flex space-x-2">
        {firstLast && (
          <Button disabled={current === 1} href={urlPrefix}>
            <ChevronDoubleLeftIcon className="mr-2 w-5 h-5" />
            First
          </Button>
        )}
        <Button
          disabled={current === 1}
          href={`${urlPrefix}${current - 1 !== 1 ? `/${current - 1}` : ''}`}
        >
          <ArrowLeftIcon className="mr-2 w-5 h-5" />
          Previous
        </Button>
      </div>
      <p className="px-2 text-gray-700">
        Page{' '}
        <span className="font-bold">
          {current}/{max}
        </span>
      </p>
      <div className="flex space-x-2">
        <Button disabled={current === max} href={`${urlPrefix}/${current + 1}`}>
          Next
          <ArrowRightIcon className="ml-2 w-5 h-5" />
        </Button>
        {firstLast && (
          <Button
            disabled={current === max}
            href={`${urlPrefix}${max === 1 ? '' : `/${max}`}`}
          >
            Last
            <ChevronDoubleRightIcon className="ml-2 w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  )
})
