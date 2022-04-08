import { memo } from 'react'

import { Eamuse } from '../../../core/components/eamuse'

export interface EamuseCardProps {
  username: string
  cardId: string
  chunkedCardId: string[]
  createdAt: string | null
}

export const EamuseCard = memo<EamuseCardProps>(props => {
  const { cardId, username, chunkedCardId, createdAt } = props

  return (
    <div className="w-full aspect-[3.37/2.125] overflow-hidden bg-gradient-to-tr from-red-50 to-gray-50 rounded-xl transition duration-300 hover:shadow-2xl hover:shadow-red-50 relative hover:scale-105">
      <Eamuse className="absolute -bottom-0 scale-150" />
      <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
        {cardId !== null && (
          <p className="font-mono text-gray-700 text-xs">Owned by {username}</p>
        )}
        <p className="font-mono text-gray-800 text-lg sm:text-xl">
          {chunkedCardId.join(' ')}
        </p>
        <p className="font-mono text-gray-700 text-sm">
          Created at: {createdAt ?? '--/--'}
        </p>
      </div>
    </div>
  )
})
