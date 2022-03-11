import { Fragment, memo } from 'react'

import { Disclosure } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/solid'

import { ItemTypeDisplay } from './itemTypeDisplay'
import { collectionTypes } from '../constants/collectionTypes'

export interface CostumeProps {
  equipped: {
    [key: string]: {
      id: number
      name: string
    }
  }
}

export const Costume = memo<CostumeProps>(props => {
  const { equipped } = props

  return (
    <Disclosure>
      {({ open }) => (
        <Fragment>
          <Disclosure.Button className="w-full py-2 bg-gradient-to-r from-indigo-50 via-red-50 to-yellow-50 rounded-xl text-gray-900 relative">
            Costume
            {!open ? (
              <PlusIcon className="w-4 h-4 absolute right-4 top-0 bottom-0 my-auto" />
            ) : (
              <MinusIcon className="w-4 h-4 absolute right-4 top-0 bottom-0 my-auto" />
            )}
          </Disclosure.Button>
          <Disclosure.Panel className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {collectionTypes
              .filter(o => o.group === 3)
              .map(collectionType => (
                <ItemTypeDisplay
                  key={`collection-${collectionType.id}`}
                  {...{
                    collectionType,
                    equippedId: equipped[collectionType.id].id,
                  }}
                />
              ))}
          </Disclosure.Panel>
        </Fragment>
      )}
    </Disclosure>
  )
})
