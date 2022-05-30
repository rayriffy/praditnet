import { memo } from 'react'
import { DifficultyBlock } from '../../../../core/components/difficultyBlock'

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
    <div className="flex flex-col sm:flex-row bg-gradient-to-r from-slate-100 to-gray-100 px-5 py-6 sm:py-4 rounded-md">
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
            <DifficultyBlock
              difficulty={music.difficulty}
              level={music.level}
            />
          </div>
          <h2 className="font-bold text-xl sm:text-2xl text-gray-900">
            {music.name}
          </h2>
          <p className="text-4xl font-light">
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
