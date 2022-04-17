import { memo } from 'react'

import { Image } from '../../../../core/components/image'
import { classNames } from '../../../../core/services/classNames'
import { ChunithmMetadata } from './chunithmMetadata'
import { MaimaiMetadata } from './maimaiMetadata'

interface Props {
  game: string
  music: {
    id: number
    name: string
    artist: string
    level: string
    difficulty: number
  }
  targetAttemptLog?: [number, number, string]
}

export const AttemptLog = memo<Props>(props => {
  const { game, music, targetAttemptLog } = props

  return (
    <div className="flex flex-col sm:flex-row bg-gradient-to-r from-slate-100 to-gray-100 dark:from-neutral-700 dark:to-stone-700 px-5 py-6 sm:py-4 rounded-md">
      <div className="flex shrink-0 justify-center sm:justify-start items-start">
        <div className="flex rounded-md overflow-hidden w-48 sm:w-40">
          <Image
            src={`https://cdn.pradit.net/${game}/jacket/${music.id}.png`}
            width={256}
            height={256}
          />
        </div>
      </div>
      <div className="px-2 sm:pl-4 mt-4 sm:mt-0 flex flex-col justify-between w-full">
        <div>
          <div className="flex mb-2">
            <div
              className={classNames(
                music.level === 'remaster'
                  ? 'bg-purple-200'
                  : music.level === 'master'
                  ? 'bg-purple-500'
                  : music.level === 'expert'
                  ? 'bg-red-500'
                  : music.level === 'advanced'
                  ? 'bg-orange-500'
                  : music.level === 'basic'
                  ? 'bg-emerald-500'
                  : 'bg-pink-500',
                music.level === 'remaster' ? 'text-purple-700' : 'text-white',
                'px-2 py-1 text-xs uppercase rounded flex items-center'
              )}
            >
              <p>{music.level}</p>
              <p
                className={classNames(
                  music.level === 'remaster'
                    ? 'bg-purple-500 text-white'
                    : music.level === 'master'
                    ? 'bg-purple-400'
                    : music.level === 'expert'
                    ? 'bg-red-400'
                    : music.level === 'advanced'
                    ? 'bg-orange-400'
                    : music.level === 'basic'
                    ? 'bg-emerald-400'
                    : 'bg-gradient-to-tr from-red-500 to-gray-700',
                  'text-sm mx-auto rounded text-center px-3 ml-2'
                )}
              >
                {Math.floor(music.difficulty)}
                {Number(music.difficulty.toFixed(1).split('.').reverse()[0]) >=
                7
                  ? '+'
                  : ''}
              </p>
            </div>
          </div>
          <h2 className="font-bold text-xl sm:text-2xl text-gray-900 dark:text-white">
            {music.name}
          </h2>
          <p className="text-4xl font-light dark:text-white">
            {game === 'maimai'
              ? (targetAttemptLog?.[1] ?? 0).toFixed(4)
              : (targetAttemptLog?.[1] ?? 0).toLocaleString()}
            {game === 'maimai' && '%'}
          </p>
        </div>
        {game === 'maimai' ? (
          <MaimaiMetadata
            metadata={
              targetAttemptLog !== undefined
                ? JSON.parse(targetAttemptLog[2])
                : undefined
            }
          />
        ) : (
          <ChunithmMetadata
            metadata={
              targetAttemptLog !== undefined
                ? JSON.parse(targetAttemptLog[2])
                : undefined
            }
          />
        )}
      </div>
    </div>
  )
})
