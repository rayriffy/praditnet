import { memo } from 'react'

import { Props } from '../../../../pages/event/[eventId]'
import { AttemptLog } from './attemptLog'

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
        <span className="text-sm mr-2">Submission ID: </span>
        <span className="font-mono text-xs mb-4 bg-gray-700 rounded transition text-white px-2 py-0.5">
          {user.id}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 mx-auto max-w-xl">
        {musics[entry.game].map(music => (
          <AttemptLog
            key={`music-${entry.game}-${music.id}`}
            game={entry.game}
            music={music}
            targetAttemptLog={entry.attemptLog.find(o => o[0] === music.id)}
          />
        ))}
      </div>
    </div>
  )
})
