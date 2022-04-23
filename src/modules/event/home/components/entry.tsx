import { memo } from 'react'

import { Props } from '../../../../pages/event/[eventId]'
import { AttemptLog } from './attemptLog'

export const Entry = memo<Pick<Props, 'entry' | 'musics' | 'user' | 'event'>>(
  props => {
    const { user, entry, musics, event } = props

    return (
      <div>
        <div className="bg-gradient-to-r from-slate-100 to-gray-100 dark:from-neutral-700 dark:to-stone-700 rounded-md px-5 py-4 block sm:flex sm:justify-between">
          <div className="flex justify-between sm:justify-start space-x-0 sm:space-x-4">
            <img
              src={`/assets/logo/${entry.game}.png`}
              className="w-40 h-auto"
            />
            <div className="flex items-center">
              <p className="py-1 px-6 font-semibold text-lg bg-gray-700 text-white rounded-md dark:bg-gray-100 dark:text-gray-900">
                {entry.inGameName}
              </p>
            </div>
          </div>
          <div className="flex items-center flex-row-reverse mt-2 justify-end sm:block">
            <div className="ml-2 sm:ml-0 flex sm:mt-2 justify-start sm:justify-center">
              <p className="bg-gray-700 text-white font-semibold text-lg rounded px-4 py-1 dark:bg-gray-100 dark:text-gray-900">
                {entry.remainingAttempts}
              </p>
            </div>
            <p className="dark:text-white">Remaining attempts</p>
          </div>
        </div>
        <div className="max-w-sm mx-auto mt-4">
          <h2 className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
            Submission ticket
          </h2>
          <div className="flex mb-4 max-w-sm p-2 bg-white shadow border rounded-lg dark:border-white">
            <div className="h-16 shrink-0">
              <img
                src={`/api/qr?${new URLSearchParams({
                  size: 100,
                  data: user.id,
                } as any).toString()}`}
                className="h-full w-auto"
              />
            </div>
            <div className="ml-2 font-mono w-full">
              <p className="text-xs bg-gray-700 rounded transition text-white px-2 text-center py-0.5 select-all">
                {user.id}
              </p>
              <div className="flex flex-col justify-between h-11">
                <p className="font-semibold">{entry.inGameName}</p>
                <p className="text-xs -mt-5">{event.name}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 mx-auto max-w-2xl mt-6">
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
  }
)
