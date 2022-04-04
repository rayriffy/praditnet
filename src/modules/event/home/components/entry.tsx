import { memo } from 'react'

import { Image } from '../../../../core/components/image'
import { Props } from '../../../../pages/event/[eventId]'

export const Entry = memo<Pick<Props, 'entry' | 'musics' | 'user'>>(props => {
  const { user, entry, musics } = props

  return (
    <div>
      <div className="bg-gradient-to-r from-slate-100 to-gray-100 dark:from-neutral-700 dark:to-stone-700 rounded-md px-5 py-4 block sm:flex sm:justify-between">
        <div className="flex justify-between sm:justify-start space-x-0 sm:space-x-4">
          <img src={`/assets/logo/${entry.game}.png`} className="w-40 h-auto" />
          <div className="flex items-center">
            <p className="py-1 px-6 font-semibold text-lg bg-gray-700 text-white rounded-md">
              {entry.inGameName}
            </p>
          </div>
        </div>
        <div className="flex items-center flex-row-reverse mt-2 justify-end sm:block">
          <div className="ml-2 sm:ml-0 flex sm:mt-2 justify-start sm:justify-center">
            <p className="bg-gray-700 text-white font-semibold text-lg rounded px-4 py-1">
              {entry.remainingAttempts}
            </p>
          </div>
          <p>Remaining attempts</p>
        </div>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-0.5">
        Qualification progress
      </h1>
      <div className="flex">
        <h2 className="font-mono text-sm text-gray-700 mb-4 bg-gray-700 rounded transition hover:text-white px-2 py-0.5">
          {user.id}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {musics[entry.game].map(music => (
          <div
            key={`music-${entry.game}-${music.id}`}
            className="flex flex-col sm:flex-row bg-gradient-to-r from-slate-100 to-gray-100 dark:from-neutral-700 dark:to-stone-700 px-5 py-6 rounded-md"
          >
            <div className="flex shrink-0 justify-center sm:justify-start items-start">
              <div className="flex rounded-md overflow-hidden w-48 sm:w-40">
                <Image
                  src={`https://cdn.pradit.net/${entry.game}/jacket/${music.id}.png`}
                  width={256}
                  height={256}
                />
              </div>
            </div>
            <div className="ml-4 mt-4 sm:mt-0">
              <h2 className="font-bold text-xl sm:text-2xl text-gray-900 dark:text-white">
                {music.name}
              </h2>
              <p className="text-4xl font-light dark:text-white">
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
