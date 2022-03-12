import { memo } from 'react'

import Link from 'next/link'

import { Disclosure } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/solid'

import { classNames } from '../../../../core/services/classNames'

import { Difficulty } from '../@types/Difficulty'

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
          <Disclosure.Button className="py-6 border-2 dark:border-gray-100 dark:bg-neutral-700 dark:text-white rounded-xl place-content-center flex mb-4 relative w-full">
            <h2 className="text-xl font-bold">{genre}</h2>
            {!open ? (
              <PlusIcon className="w-4 h-4 absolute right-4 top-0 bottom-0 my-auto" />
            ) : (
              <MinusIcon className="w-4 h-4 absolute right-4 top-0 bottom-0 my-auto" />
            )}
          </Disclosure.Button>
          <Disclosure.Panel className="space-y-4">
            {musics.map(music => (
              <Link
                key={`genre-${genre}-music-${music.id}`}
                href={`/chunithm/ranking/${currentDifficulty.key}/${music.id}`}
              >
                <a
                  key={`genre-${genre}-music-${music.id}`}
                  className={classNames(
                    currentDifficulty.color.secondary,
                    currentDifficulty.color.border,
                    'p-2 border-2 rounded-md flex justify-between space-x-2'
                  )}
                >
                  <div className="w-full">
                    <p
                      className={classNames(
                        currentDifficulty.color.primary,
                        'uppercase text-sm font-extrabold text-white rounded px-2'
                      )}
                    >
                      {currentDifficulty.name}
                    </p>
                    <p className="bg-neutral-800 text-white mt-1 rounded-md px-2 py-2">
                      {music.name}
                    </p>
                  </div>
                  <div className="shrink-0 border-2 border-neutral-800 rounded-md w-14 bg-white flex flex-col">
                    <div className="uppercase text-xs bg-neutral-800 text-white py-0.5 text-center shrink-0">
                      level
                    </div>
                    <div className="h-full flex justify-center items-center">
                      {music.level}
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
})
