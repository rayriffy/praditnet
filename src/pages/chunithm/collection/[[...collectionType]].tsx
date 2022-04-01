import { Fragment, useEffect, useRef, useState } from 'react'

import { GetServerSideProps, NextPage } from 'next'
import dynamic from 'next/dynamic'

import { collectionTypes } from '../../../modules/chunithm/collection/constants/collectionTypes'
import { Item } from '../../../modules/chunithm/collection/components/item'
import { Navbar } from '../../../modules/chunithm/home/components/navbar'
import { ItemTypeDisplay } from '../../../modules/chunithm/collection/components/itemTypeDisplay'
import { CostumeProps } from '../../../modules/chunithm/collection/components/costume'

import { AppProps } from '../../../app/@types/AppProps'

const Costume = dynamic<CostumeProps>(
  () =>
    import('../../../modules/chunithm/collection/components/costume').then(
      o => o.Costume
    ),
  {
    ssr: false,
  }
)

interface Props extends AppProps {
  equipped: {
    [key: string]: {
      id: number
      name: string
      rarity?: number
    }
  }
  collection: {
    type: string
    // equippable: number[]
    items: {
      id: number
      name: string
      works?: string
      rarity?: number
    }[]
  } | null
}

const Page: NextPage<Props> = props => {
  const { collection, equipped } = props

  return (
    <Fragment>
      <Navbar />
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {collectionTypes
            .filter(o => o.group === 1)
            .map(collectionType => (
              <ItemTypeDisplay
                key={`collection-${collectionType.id}`}
                {...{
                  collectionType,
                  equippedId: equipped[collectionType.id].id,
                }}
              />
            ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {collectionTypes
            .filter(o => o.group === 2)
            .map(collectionType => (
              <ItemTypeDisplay
                key={`collection-${collectionType.id}`}
                {...{
                  collectionType,
                  equippedId: equipped[collectionType.id].id,
                  trophyData:
                    collectionType.id === 'trophy'
                      ? equipped[collectionType.id]
                      : undefined,
                }}
              />
            ))}
        </div>
        <div className="grid grid-cols-1">
          {collectionTypes
            .filter(o => o.group === 4)
            .map(collectionType => (
              <ItemTypeDisplay
                key={`collection-${collectionType.id}`}
                {...{
                  collectionType,
                  equippedId: equipped[collectionType.id].id,
                }}
              />
            ))}
        </div>
        <Costume {...{ equipped }} />
      </div>
      {/* {collection !== null && (
        <ItemList
          type={collectionTypes.find(o => o.id === collection.type)}
          items={collection.items}
          capchaRef={recaptchaRef}
        />
      )} */}
      {collection !== null && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 mx-auto">
          {collection.items.map(item => (
            <Item
              collection={collectionTypes.find(o => o.id === collection.type)}
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
      user: {
        cardId: user.card_luid,
      },
      equipped,
      collection,
    },
  }
}

export default Page
