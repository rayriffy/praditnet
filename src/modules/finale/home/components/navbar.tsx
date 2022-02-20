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
    id: 'score',
    title: 'Score',
  },
]

export const Navbar = memo(props => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
    {navbars.map(navbar => (
      <Link href={`/finale/${navbar.id}`} key={`finale-navigation-${navbar.id}`}>
        <a
          key={`finale-navbar-${navbar.id}`}
          className="border text-gray-900 hover:bg-gray-50 hover:text-gray-900 py-2 px-4 rounded-lg font-medium text-sm text-center"
        >
          {navbar.title}
        </a>
      </Link>
    ))}
  </div>
  )
})
