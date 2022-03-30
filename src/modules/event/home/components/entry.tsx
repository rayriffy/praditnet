import { memo } from 'react'

import { Image } from '../../../../core/components/image'
import { Props } from '../../../../pages/event/[eventId]'

export const Entry = memo<Pick<Props, 'entry' | 'musics'>>(props => {
  const { entry, musics } = props

  return (
    <div>
      <div className="bg-gray-100 rounded-md px-5 py-4 block sm:flex sm:justify-between">
        <div className="flex justify-between sm:justify-start space-x-0 sm:space-x-4">
          <img src={`/assets/logo/${entry.game}.png`} className="w-40 h-auto" />
          <div className="flex items-center">
            <p className="py-1 px-6 font-semibold text-lg bg-white rounded-md">
              {entry.inGameName}
            </p>
          </div>
        </div>
        <div className="flex items-center mt-2 justify-end sm:block">
          <p>Remaining attempts</p>
          <div className="ml-2 sm:ml-0 flex sm:mt-2 justify-start sm:justify-center">
            <p className="bg-white font-semibold text-lg rounded px-4 py-1">
              {entry.remainingAttempts}
            </p>
          </div>
        </div>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-3">
        Qualification progress
      </h1>
      <div className="grid grid-cols-1 gap-4">
        {musics[entry.game].map(music => (
          <div
            key={`music-${entry.game}-${music.id}`}
            className="flex bg-gray-50 p-4 rounded-md"
          >
            <div className="flex shrink-0 items-start">
              <div className="flex rounded-md overflow-hidden w-28 sm:w-40">
                <Image
                  src={`https://praditnet-cdn.rayriffy.com/${entry.game}/jacket/${music.id}.png`}
                  width={200}
                  height={200}
                />
              </div>
            </div>
            <div className="ml-4">
              <h2 className="text-lg sm:text-2xl font-bold">{music.name}</h2>
              <p className="mt-1 sm:mt-3 text-3xl sm:text-4xl font-light">
                {entry.attemptLog.find(o => o[0] === music.id)?.[1] ?? 0}
                {entry.game === 'maimai' && '%'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})
