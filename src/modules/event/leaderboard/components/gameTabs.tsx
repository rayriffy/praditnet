import { memo } from 'react'

import { Tab } from '@headlessui/react'

import { Leaderboard } from './leaderboard'
import { classNames } from '../../../../core/services/classNames'

export interface GameTabsProps {
  event: {
    id: string
    games: string[]
  }
}

export const GameTabs = memo<GameTabsProps>(props => {
  const { event } = props
  return (
    <Tab.Group>
      <Tab.List className="flex space-x-1 rounded-xl bg-blue-400/20 p-1">
        {event.games.map(game => (
          <Tab
            key={`ranking-tab-header-${game}`}
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            <img
              src={`/assets/logo/${game}.png`}
              className="h-14 sm:h-20 w-auto mx-auto"
            />
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="mt-2">
        {event.games.map(game => (
          <Tab.Panel key={`ranking-tab-content-${game}`}>
            <Leaderboard eventId={event.id} gameId={game} />
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  )
})
