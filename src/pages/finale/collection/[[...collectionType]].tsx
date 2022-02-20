import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'

import {
  ArrowRightIcon,
  PencilAltIcon,
  PencilIcon,
} from '@heroicons/react/solid'

import { classNames } from '../../../core/services/classNames'
import { collectionTypes } from '../../../modules/finale/collection/constants/collectionTypes'
import { Fragment, useEffect } from 'react'

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

  // console.log({ icon, frame, nameplate, title })
  useEffect(() => {
    console.log(props)
  }, [])

  return (
    <Fragment>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {collectionTypes.map(collectionType => (
          <Link
            key={`collection-${collectionType.id}`}
            href={`/finale/collection/${collectionType.id}`}
          >
            <a
              className={classNames(
                collectionType.id === 'icon' ? 'md:col-span-1' : 'md:col-span-2',
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
                    collectionType.id === 'icon' ? 'w-1/2 md:w-full' : 'w-full',
                  )}
                  src={`https://praditnet-cdn.rayriffy.com/finale/${
                    collectionType.id
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
            <div key={`collection-item-${collection.type}-${item.id}`} className="rounded-lg flex p-4 bg-gradient-to-r from-sky-100 to-blue-100">
              <div className="shrink-0 flex items-center">
                <img
                  src={`https://praditnet-cdn.rayriffy.com/finale/${collection.type}/${item.id}.png`}
                  className="w-24"
                  loading="lazy"
                />
              </div>
              <div className="pl-4 flex flex-col justify-between w-full">
                <div>
                  <h1 className="font-semibold">{item.name}</h1>
                  <div className="border-t-4 border-dotted border-gray-400 my-1"></div>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <div className="flex justify-end mt-4">
                  <button className={classNames(
                    collection.equippable.some(o => o === item.id) ? 'from-sky-500 to-blue-500' : 'from-slate-500 to-neutral-500 cursor-not-allowed',
                    `text-white bg-gradient-to-r px-6 py-1 rounded-lg text-sm`)}
                    disabled={!collection.equippable.some(o => o === item.id)}>{collection.equippable.some(o => o === item.id) ? 'Set' : 'Locked'}</button>
                </div>
              </div>
            </div>
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
