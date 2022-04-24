import { Fragment, memo, useMemo } from 'react'

import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/solid'
import { classNames } from '../../../core/services/classNames'

import { UserPreview } from '../@types/UserPreview'

interface Props {
  game: {
    id: string
    name: string
    background: string
    rating?(input: number): string
  }
  userPreview: UserPreview | undefined
}

export const PreviewCard = memo<Props>(props => {
  const {
    game: { id, background, rating = input => input.toFixed(2) },
    userPreview,
  } = props

  const cardContent = useMemo(
    () => (
      <Fragment>
        <img
          src={`/assets/logo/${id}.png`}
          className="h-24 w-auto mx-auto absolute -top-10 left-0 right-0"
        />
        <div
          className={classNames(
            userPreview === null || userPreview === undefined
              ? 'justify-center items-center h-full'
              : 'justify-between items-center',
            'mt-1 py-1 px-4 flex'
          )}
        >
          {userPreview === null || userPreview === undefined ? (
            <p className="text-sm">
              {userPreview === undefined ? 'Unavailable' : 'No data'}
            </p>
          ) : (
            <Fragment>
              <div>
                <p className="text-lg font-semibold">{userPreview.name}</p>
                <p className="text-sm">
                  Rating:{' '}
                  <b className="font-semibold">{rating(userPreview.rating)}</b>
                </p>
              </div>
              <ArrowRightIcon className="w-6 h-6" />
            </Fragment>
          )}
        </div>
      </Fragment>
    ),
    []
  )

  return (
    <Fragment>
      {userPreview === null || userPreview === undefined ? (
        <div
          className={classNames(
            userPreview === null || userPreview === undefined
              ? 'hover:cursor-not-allowed grayscale'
              : 'hover:cursor-pointer',
            background,
            'bg-gradient-to-r px-5 py-4 rounded-2xl relative text-white pt-14 transition duration-300 hover:scale-105'
          )}
        >
          {cardContent}
        </div>
      ) : (
        <Link href={`/${id}`}>
          <a
            className={classNames(
              userPreview === null || userPreview === undefined
                ? 'hover:cursor-not-allowed grayscale'
                : 'hover:cursor-pointer',
              background,
              'bg-gradient-to-r px-5 py-4 rounded-2xl relative text-white pt-14 transition duration-300 hover:scale-105'
            )}
          >
            {cardContent}
          </a>
        </Link>
      )}
    </Fragment>
  )
})
