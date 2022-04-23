import { FunctionComponent, memo, PropsWithChildren } from 'react'

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

const DisabledButton: FunctionComponent<{ showWhen?: 'small' | 'large' }> = ({
  showWhen,
  ...props
}) => (
  <div
    className={classNames(
      showWhen === 'large'
        ? 'hidden sm:inline-flex'
        : showWhen === 'small'
        ? 'inline-flex sm:hidden'
        : 'inline-flex',
      'items-center py-2 px-4 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-neutral-600 dark:border-white dark:text-gray-200 dark:hover:bg-neutral-700 dark:hover:text-white transition cursor-not-allowed'
    )}
    {...props}
  />
)

const LinkedButton: FunctionComponent<{
  href: string
  showWhen?: 'small' | 'large'
}> = ({ href, showWhen, ...props }) => (
  <Link href={href}>
    <a
      className={classNames(
        showWhen === 'large'
          ? 'hidden sm:inline-flex'
          : showWhen === 'small'
          ? 'inline-flex sm:hidden'
          : 'inline-flex',
        'items-center py-2 px-4 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-neutral-700 dark:border-white dark:text-gray-200 dark:hover:bg-neutral-600 dark:hover:text-white transition'
      )}
      {...props}
    />
  </Link>
)

const Button: FunctionComponent<
  PropsWithChildren<{
    disabled: boolean
    showWhen?: 'small' | 'large'
    href: string
  }>
> = ({ disabled, href, ...props }) =>
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
          <Button
            disabled={current - 5 < 1}
            showWhen="large"
            href={`${urlPrefix}${current - 5 === 1 ? '/' : `/${current - 5}`}`}
          >
            <ChevronDoubleLeftIcon className="mr-2 w-5 h-5" />5 Pages
          </Button>
        )}
        <Button
          disabled={current === 1}
          href={`${urlPrefix}${current - 1 !== 1 ? `/${current - 1}` : ''}`}
        >
          <ArrowLeftIcon className="mr-2 w-5 h-5" />
          Previous
        </Button>
        {firstLast && (
          <Button
            disabled={current === max}
            showWhen="small"
            href={`${urlPrefix}/${current + 1}`}
          >
            Next
            <ArrowRightIcon className="ml-2 w-5 h-5" />
          </Button>
        )}
      </div>
      <p className="px-2 text-gray-700 dark:text-gray-100">
        Page{' '}
        <span className="font-bold">
          {current}/{max}
        </span>
      </p>
      <div className="flex space-x-2">
        {firstLast && (
          <Button
            disabled={current - 5 < 1}
            showWhen="small"
            href={`${urlPrefix}${current - 5 === 1 ? '/' : `/${current - 5}`}`}
          >
            <ChevronDoubleLeftIcon className="mr-2 w-5 h-5" />5 Pages
          </Button>
        )}
        <Button
          disabled={current === max}
          showWhen={firstLast ? 'large' : undefined}
          href={`${urlPrefix}/${current + 1}`}
        >
          Next
          <ArrowRightIcon className="ml-2 w-5 h-5" />
        </Button>
        {firstLast && (
          <Button
            disabled={current + 5 > max}
            href={`${urlPrefix}/${current + 5}`}
          >
            5 Pages
            <ChevronDoubleRightIcon className="ml-2 w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  )
})
