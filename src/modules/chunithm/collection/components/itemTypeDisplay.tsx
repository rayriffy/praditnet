import { memo, useMemo } from 'react'

import Link from 'next/link'

import { PencilAltIcon } from '@heroicons/react/solid'

import { Image } from '../../../../core/components/image'
import { CollectionType } from '../constants/collectionTypes'
import { classNames } from '../../../../core/services/classNames'

interface Props {
  collectionType: CollectionType
  equippedId: number
}

export const ItemTypeDisplay = memo<Props>(props => {
  const { collectionType, equippedId } = props

  const isSmallItem = useMemo(
    () =>
      ['character', 'mapIcon', 'avatar'].some(o =>
        collectionType.id.startsWith(o)
      ),
    []
  )

  return (
    <Link href={`/chunithm/collection/${collectionType.id}`}>
      <a
        className={classNames(
          collectionType.id === 'frame'
            ? 'md:col-span-4'
            : collectionType.id === 'nameplate'
            ? 'md:col-span-3'
            : 'md:col-span-2',
          'p-6 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-lg hover:cursor-pointer'
        )}
      >
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-white text-xl font-bold">
            {collectionType.name}
          </h1>
          <PencilAltIcon className="text-white w-6" />
        </div>
        {collectionType.id !== 'title' ? (
          <div
            className={classNames(
              isSmallItem ? 'w-28' : '',
              'flex justify-center mx-auto'
            )}
          >
            <Image
              className={classNames(
                isSmallItem
                  ? 'w-24 rounded overflow-hidden'
                  : // ? 'w-1/3 md:w-2/3 rounded overflow-hidden'
                  collectionType.id === 'systemVoice'
                  ? 'w-2/3 md:w-full'
                  : 'w-full',
                ['character', 'mapIcon'].includes(collectionType.id)
                  ? 'bg-gray-100'
                  : ''
              )}
              src={`https://praditnet-cdn.rayriffy.com/chunithm/${
                collectionType.assetPath ?? collectionType.id
              }/${equippedId}.png`}
              {...collectionType.image}
            />
          </div>
        ) : null}
      </a>
    </Link>
  )
})
