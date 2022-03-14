import { divide } from 'lodash'
import { memo, MutableRefObject, useState } from 'react'

import ReCAPTCHA from 'react-google-recaptcha'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Spinner } from '../../../../core/components/spinner'

import { CollectionType } from '../constants/collectionTypes'
import { Item } from './item'

interface Props {
  type: CollectionType
  items: {
    id: number
    name: string
    works?: string
    rarity?: number
  }[]
  capchaRef: MutableRefObject<ReCAPTCHA>
}

export const ItemList = memo<Props>(props => {
  const { items, type, capchaRef } = props

  const [count, setCount] = useState({
    prev: 0,
    next: 100,
  })
  const [hasMore, setHasMore] = useState(true)
  const [current, setCurrent] = useState(items.slice(count.prev, count.next))

  const getMoreData = () => {
    if (current.length === items.length) {
      setHasMore(false)
      return
    }
    setTimeout(() => {
      setCurrent(
        current.concat(items.slice(count.prev + 100, count.next + 100))
      )
    }, 1000)
    setCount(prev => ({ prev: prev.prev + 100, next: prev.next + 100 }))
  }

  return (
    <InfiniteScroll
      dataLength={current.length}
      next={getMoreData}
      hasMore={hasMore}
      loader={
        <div className="mt-6 flex justify-center">
          <h1 className="text-base text-gray-700 font-semibold">Loading...</h1>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 mx-auto">
        {current &&
          current.map(item => (
            <Item
              collection={type}
              item={item}
              key={`collection-item-${type.id}-${item.id}`}
              capchaRef={capchaRef}
            />
          ))}
      </div>
    </InfiniteScroll>
  )
})
