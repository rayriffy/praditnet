import { memo, useRef } from 'react'

import { Disclosure } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/solid'

import { Difficulty } from '../@types/Difficulty'
import { Music } from './Music'

export interface MusicListingProps {
  genre: string
  currentDifficulty: Difficulty
  musics: {
    id: number
    name: string
    level: number
  }[]
}

export const MusicListing = memo<MusicListingProps>(props => {
  const { genre, musics, currentDifficulty } = props

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="py-6 border-2 rounded-xl place-content-center flex mb-4 relative w-full">
            <h2 className="text-xl font-bold">{genre}</h2>
            {!open ? (
              <PlusIcon className="w-4 h-4 absolute right-4 top-0 bottom-0 my-auto" />
            ) : (
              <MinusIcon className="w-4 h-4 absolute right-4 top-0 bottom-0 my-auto" />
            )}
          </Disclosure.Button>
          <Disclosure.Panel className="space-y-4">
            {musics.map(music => (
              <Music
                key={`genre-${genre}-music-${music.id}`}
                music={music}
                currentDifficulty={currentDifficulty}
              />
            ))}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
})
