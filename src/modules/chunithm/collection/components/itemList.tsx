import { memo, MutableRefObject, useEffect, useState } from 'react'

import ReCAPTCHA from 'react-google-recaptcha'
import InfiniteScroll from 'react-infinite-scroll-component'

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

  useEffect(() => {
    setCount({
      prev: 0,
      next: 100,
    })
    setHasMore(true)
    setCurrent(items.slice(0, 100))
  }, [items])

  const getMoreData = () => {
    console.log('more data!!')
    console.log({
      hasMore,
      current: current.length,
      items: items.length,
    })
    if (current.length === items.length) {
      setHasMore(false)
      return
    }
    setTimeout(() => {
      setCurrent(prev =>
        prev.concat(items.slice(count.prev + 100, count.next + 100))
      )
      setCount(prev => ({ prev: prev.prev + 100, next: prev.next + 100 }))
    }, 2000)
  }

  return (
    <InfiniteScroll
      dataLength={items.length}
      next={getMoreData}
      hasMore={hasMore}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 mx-auto"
      loader={
        <div className="mt-6 flex justify-center col-span-2">
          <h1 className="text-base text-gray-700 font-semibold">Loading...</h1>
        </div>
      }
    >
      {current &&
        current.map(item => (
          <Item
            collection={type}
            item={item}
            key={`collection-item-${type.id}-${item.id}`}
            capchaRef={capchaRef}
          />
        ))}
    </InfiniteScroll>
  )
})
