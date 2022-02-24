import { Fragment, useEffect } from 'react'

import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'

import {
  ArrowRightIcon,
  PencilAltIcon,
  PencilIcon,
} from '@heroicons/react/solid'

import { Item } from '../../../modules/chunithm/collection/components/item'

import { classNames } from '../../../core/services/classNames'
import { collectionTypes } from '../../../modules/chunithm/collection/constants/collectionTypes'
import { Navbar } from '../../../modules/chunithm/home/components/navbar'

interface Props {
  character: {
    id: number
    name: string
  }
  nameplate: {
    id: number
    name: string
  }
  systemVoice: {
    id: number
    name: string
  }
  collection: {
    type: string
    // equippable: number[]
    items: {
      id: number
      name: string
      works?: string
    }[]
  } | null
}

const Page: NextPage<Props> = props => {
  const { collection } = props

  return (
    <Fragment>
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {collectionTypes.map(collectionType => (
          <Link
            key={`collection-${collectionType.id}`}
            href={`/chunithm/collection/${collectionType.id}`}
          >
            <a
              className={classNames(
                collectionType.id === 'nameplate'
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
                <img
                  className={classNames(
                    'mx-auto',
                    collectionType.id === 'character'
                      ? 'w-1/3 md:w-2/3 bg-gray-100 rounded overflow-hidden'
                      : collectionType.id === 'systemVoice'
                      ? 'w-2/3 md:w-full'
                      : 'w-full'
                  )}
                  src={`https://praditnet-cdn.rayriffy.com/chunithm/${
                    collectionType.id
                  }${
                    ['character', 'systemVoice'].includes(collectionType.id)
                      ? '/icon'
                      : ''
                  }/${props[collectionType.id].id}.png`}
                />
              ) : null}
            </a>
          </Link>
        ))}
      </div>
      {collection !== null && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 mx-auto">
          {collection.items.map(item => (
            <Item
              type={collection.type}
              item={item}
              key={`collection-item-${collection.type}-${item.id}`}
            />
          ))}
        </div>
      )}
    </Fragment>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { collectionType = [] } = ctx.params

  const { getEquipped } = await import(
    '../../../modules/chunithm/collection/services/getEquipped'
  )
  const { getCollection } = await import(
    '../../../modules/chunithm/collection/services/getCollection'
  )

  const targetCollectionType = collectionType[0]

  if (
    targetCollectionType !== undefined &&
    collectionTypes.find(o => o.id === targetCollectionType) === undefined
  ) {
    return {
      notFound: true,
    }
  }

  const equipped = await getEquipped()
  const collection =
    targetCollectionType !== undefined
      ? await getCollection(targetCollectionType as string)
      : null

  ctx.res.setHeader('Cache-Control', 'max-age=60, public')

  return {
    props: {
      ...equipped,
      collection,
    },
  }
}

export default Page
