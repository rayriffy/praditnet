import { memo, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { Tab } from '@headlessui/react'
import { classNames } from '../../../core/services/classNames'

import { AimeTabProps } from './aimeTab'
import { EamuseTabProps } from './eamuseTab'

const AimeTab = dynamic<AimeTabProps>(() =>
  import('./aimeTab').then(o => o.AimeTab)
)
const EamuseTab = dynamic<EamuseTabProps>(() =>
  import('./eamuseTab').then(o => o.EamuseTab)
)

export interface CardTabsProps {
  username: string
  aime: {
    cardId: string
    chunkedCardId: string[]
    luid: string | null
    createdAt: string | null
  }
  eamuse: {
    cardId: string
    chunkedCardId: string[]
    luid: string | null
    createdAt: string | null
  }
}

export const CardTabs = memo<CardTabsProps>(props => {
  const { username, aime, eamuse } = props

  const categories = useMemo(
    () => [
      ['aime', 'Aime'],
      ['eamuse', 'e-Amusement'],
    ],
    []
  )
  return (
    <div className="">
      <Tab.Group>
        <Tab.List className="flex p-1 space-x-1 bg-blue-300/20 rounded-xl">
          {categories.map(category => (
            <Tab
              key={category[0]}
              className={({ selected }) =>
                classNames(
                  'w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg',
                  'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
                  selected
                    ? 'bg-white shadow'
                    : 'text-blue-400 hover:bg-white/[0.12] hover:text-blue-600'
                )
              }
            >
              {category[1]}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-4">
          {categories.map((category, idx) => (
            <Tab.Panel key={idx}>
              {category[0] === 'aime' ? (
                <AimeTab username={username} {...props.aime} />
              ) : (
                <EamuseTab username={username} {...props.eamuse} />
              )}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
})
