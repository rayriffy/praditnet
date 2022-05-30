import { memo } from 'react'

import Link from 'next/link'

const navbars = [
  {
    id: '',
    title: 'Home',
  },
  {
    id: 'playlog',
    title: 'Playlog',
  },
  {
    id: 'collection',
    title: 'Collection',
  },
  {
    id: 'ranking',
    title: 'Ranking',
  },
  {
    id: 'character',
    title: 'Character',
  },
  {
    id: 'deck',
    title: 'Decks',
  },
  {
    id: 'cards',
    title: 'Cards',
  },
  {
    id: 'rival',
    title: 'Rivals',
  },
]

export const Navbar = memo(props => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 py-4">
      {navbars.map(navbar => (
        <Link
          href={`/ongeki/${navbar.id}`}
          key={`ongeki-navigation-${navbar.id}`}
        >
          <a className="border text-gray-900 hover:bg-gray-50 py-2 px-4 rounded-lg font-medium text-sm text-center">
            {navbar.title}
          </a>
        </Link>
      ))}
    </div>
  )
})
