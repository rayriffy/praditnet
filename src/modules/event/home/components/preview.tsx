import { Fragment, memo } from 'react'

import Link from 'next/link'

import { Image } from '../../../../core/components/image'
import { classNames } from '../../../../core/services/classNames'
import { DifficultyBlock } from '../../../../core/components/difficultyBlock'

interface Props {
  eventId: string
  musics: {
    [key: string]: {
      id: number
      name: string
      artist: string
      level: string
      difficulty: number
    }[]
  }
  isEventEnded: boolean
}

export const Preview = memo<Props>(props => {
  const { eventId, musics, isEventEnded } = props

  return (
    <Fragment>
      <div className="border-4 border-dashed p-6 rounded-lg">
        <h1
          className={classNames(
            isEventEnded ? '' : 'mb-2',
            'text-center font-bold text-lg text-gray-900'
          )}
        >
          {isEventEnded
            ? 'Event is over! Registration closed'
            : "You're not registered for competition yet!"}
        </h1>
        {!isEventEnded && (
          <div className="flex justify-center">
            <Link href={`/event/${eventId}/apply`}>
              <a className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Apply now
              </a>
            </Link>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(musics).map(([game, musics]) => (
          <div
            key={`music-grid-${game}`}
            className="bg-gray-100 rounded-md mt-14 px-6 pb-4"
          >
            <img
              src={`/assets/logo/${game}.png`}
              className={classNames(
                game === 'maimai' ? 'w-56' : 'w-64',
                'h-auto mx-auto -mt-12'
              )}
            />
            <h1 className="font-bold text-xl my-2">Qualifying songs</h1>
            <div className="my-2 grid grid-cols-2 items-start gap-6">
              {musics.map(music => (
                <div
                  key={`music-${game}-${music.id}`}
                  className="flex flex-col justify-center items-center"
                >
                  <div className="rounded overflow-hidden flex">
                    <Image
                      src={`https://cdn.pradit.net/${game}/jacket/${music.id}.png`}
                      width={200}
                      height={200}
                    />
                  </div>
                  <p className="text-gray-900 text-sm font-bold text-center mt-2">
                    {music.name}
                  </p>
                  <div className="flex mt-2">
                    <DifficultyBlock
                      level={music.level}
                      difficulty={music.difficulty}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  )
})
