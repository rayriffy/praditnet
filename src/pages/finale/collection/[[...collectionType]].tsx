import { Fragment, useEffect } from 'react'

import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'

import {
  ArrowRightIcon,
  PencilAltIcon,
  PencilIcon,
} from '@heroicons/react/solid'

import { Item } from '../../../modules/finale/collection/components/item'

import { classNames } from '../../../core/services/classNames'
import { collectionTypes } from '../../../modules/finale/collection/constants/collectionTypes'
import { Navbar } from '../../../modules/finale/home/components/navbar'

interface Props {
  icon: {
    id: number
    name: string
  }
  frame: {
    id: number
    name: string
  }
  nameplate: {
    id: number
    name: string
  }
  title: {
    id: number
    name: string
  }
  collection: {
    type: string
    equippable: number[]
    items: {
      id: number
      name: string
      description: string
      price: number
      genre: number
    }[]
  } | null
}

const Page: NextPage<Props> = props => {
  const { collection } = props

  return (
    <Fragment>
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {collectionTypes.map(collectionType => (
          <Link
            key={`collection-${collectionType.id}`}
            href={`/finale/collection/${collectionType.id}`}
          >
            <a
              className={classNames(
                collectionType.id === 'icon'
                  ? 'md:col-span-1'
                  : 'md:col-span-2',
                'p-6 bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-lg hover:cursor-pointer'
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
                    collectionType.id === 'icon' ? 'w-1/2 md:w-full' : 'w-full'
                  )}
                  src={`https://praditnet-cdn.rayriffy.com/finale/${
                    collectionType.id === 'frame'
                      ? 'frameMini'
                      : collectionType.id
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
              isEquippable={collection.equippable.some(o => o === item.id)}
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
    '../../../modules/finale/collection/services/getEquipped'
  )
  const { getCollection } = await import(
    '../../../modules/finale/collection/services/getCollection'
  )
  const { getApiUserSession } = await import(
    '../../../core/services/authentication/api/getApiUserSession'
  )

  // check for user session
  const user = await getApiUserSession(ctx.req)

  if (user === null || user === undefined) {
    return {
      redirect: {
        statusCode: 302,
        destination: '/login',
      },
    }
  }

  const targetCollectionType = collectionType[0]

  if (
    targetCollectionType !== undefined &&
    collectionTypes.find(o => o.id === targetCollectionType) === undefined
  ) {
    return {
      notFound: true,
    }
  }

  const equipped = await getEquipped(user.card_luid)
  const collection =
    targetCollectionType !== undefined
      ? await getCollection(user.card_luid, targetCollectionType as string)
      : null

  return {
    props: {
      ...equipped,
      collection,
    },
  }
}

export default Page
