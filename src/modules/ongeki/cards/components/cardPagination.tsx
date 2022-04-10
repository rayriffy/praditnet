import { FunctionComponent, memo } from 'react'

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/solid'
import { classNames } from '../../../../core/services/classNames'

interface Props {
  pagination: {
    current: number
    max: number
  }
  onPaginate: (leapSize: number) => void
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

const TriggerableButton: FunctionComponent<{
  showWhen?: 'small' | 'large'
  onPaginate: (leapSize: number) => void
  leapSize: number
}> = ({ showWhen, onPaginate, leapSize, ...props }) => (
  <button
    className={classNames(
      showWhen === 'large'
        ? 'hidden sm:inline-flex'
        : showWhen === 'small'
        ? 'inline-flex sm:hidden'
        : 'inline-flex',
      'items-center py-2 px-4 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-neutral-700 dark:border-white dark:text-gray-200 dark:hover:bg-neutral-600 dark:hover:text-white transition'
    )}
    onClick={() => onPaginate(leapSize)}
    {...props}
  />
)

const Button: FunctionComponent<{
  disabled: boolean
  showWhen?: 'small' | 'large'
  onPaginate: (leapSize: number) => void
  leapSize: number
}> = ({ disabled, ...props }) =>
  disabled ? <DisabledButton {...props} /> : <TriggerableButton {...props} />

export const CardPagination = memo<Props>(props => {
  const {
    pagination: { current, max },
    onPaginate,
  } = props

  return (
    <div className="flex flex-col space-y-2 sm:flex-row justify-center items-center mt-8 space-x-2">
      <div className="flex space-x-2">
        <Button
          disabled={current - 5 < 1}
          showWhen="large"
          onPaginate={onPaginate}
          leapSize={-5}
        >
          <ChevronDoubleLeftIcon className="mr-2 w-5 h-5" />5 Pages
        </Button>
        <Button disabled={current === 1} onPaginate={onPaginate} leapSize={-1}>
          <ArrowLeftIcon className="mr-2 w-5 h-5" />
          Previous
        </Button>
        <Button
          disabled={current === max}
          showWhen="small"
          onPaginate={onPaginate}
          leapSize={1}
        >
          Next
          <ArrowRightIcon className="ml-2 w-5 h-5" />
        </Button>
      </div>
      <p className="px-2 text-gray-700 dark:text-gray-100">
        Page{' '}
        <span className="font-bold">
          {current}/{max}
        </span>
      </p>
      <div className="flex space-x-2">
        <Button
          disabled={current - 5 < 1}
          showWhen="small"
          onPaginate={onPaginate}
          leapSize={-5}
        >
          <ChevronDoubleLeftIcon className="mr-2 w-5 h-5" />5 Pages
        </Button>
        <Button
          disabled={current === max}
          showWhen="large"
          onPaginate={onPaginate}
          leapSize={1}
        >
          Next
          <ArrowRightIcon className="ml-2 w-5 h-5" />
        </Button>
        <Button
          disabled={current + 5 > max}
          onPaginate={onPaginate}
          leapSize={5}
        >
          5 Pages
          <ChevronDoubleRightIcon className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  )
})
