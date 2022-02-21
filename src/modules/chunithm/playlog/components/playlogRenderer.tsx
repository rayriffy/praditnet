import { memo } from 'react'

import { classNames } from '../../../../core/services/classNames'

import { UserPlaylog } from '../@types/UserPlaylog'
import { judges } from '../constants/judges'
import { ranks } from '../constants/ranks'

interface Props {
  playlogs: UserPlaylog[]
}

export const PlaylogRenderer = memo<Props>(props => {
  const { playlogs } = props

  return (
    <div className="grid grid-cols-1 gap-6">
      {playlogs.map(playlog => (
        <div
          className="p-4 md:p-6 bg-gradient-to-r from-slate-100 to-gray-100 dark:from-gray-700 dark:to-slate-700 rounded-xl sm:flex"
          key={`playlog-${playlog.id}`}
        >
          <div className="mx-auto mb-4 sm:m-0 w-48 md:w-48 shrink-0 flex items-start">
            <img
              className="w-full h-auto rounded"
              src={`https://praditnet-cdn.rayriffy.com/chunithm/jacket/${playlog.musicId}.png`}
              loading="lazy"
            />
          </div>
          <div className="sm:ml-6 w-full">
            <span
              className={classNames(
                playlog.difficulty === 'master'
                  ? 'bg-purple-500'
                  : playlog.difficulty === 'expert'
                  ? 'bg-red-500'
                  : playlog.difficulty === 'advanced'
                  ? 'bg-orange-500'
                  : playlog.difficulty === 'basic'
                  ? 'bg-emerald-500'
                  : playlog.difficulty === 'ultima'
                  ? 'bg-gradient-to-tr from-red-500 to-gray-900'
                  : 'bg-gradient-to-r from-sky-500 via-rose-500 to-lime-500',
                'py-1 px-2 text-white text-xs uppercase rounded'
              )}
            >
              {playlog.difficulty}
            </span>
            <h1 className="font-bold text-2xl text-gray-900 dark:text-white mt-3">
              {playlog.musicTitle}
            </h1>
            <div className="flex justify-between items-center">
              <div>
                <p className="py-2 text-2xl md:text-4xl font-light dark:text-white">
                  {playlog.score.toLocaleString()}
                </p>
                <p className="text-gray-700 text-sm dark:text-gray-300">
                  Track {playlog.track} · {playlog.playDate}
                </p>
              </div>
              <img
                className="w-32"
                src={`/assets/chunithm/rank/${
                  ranks.find(rank => rank.score <= playlog.score).id
                }.png`}
                loading="lazy"
              />
            </div>
            <div className="pt-4 flex flex-col">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {judges.map(judge => (
                  <div
                    key={`playlog-${playlog.id}-${judge.id}`}
                    className={classNames(
                      judge.color,
                      'text-white p-1.5 text-center rounded-lg'
                    )}
                  >
                    <p className={classNames(judge.subColor, 'rounded p-1')}>
                      {playlog.judge[judge.id]}
                    </p>
                    <span className="px-2 text-sm">{judge.name}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                <div
                  className={classNames(
                    playlog.isClear
                      ? 'from-amber-400 to-yellow-400 text-gray-900'
                      : 'from-gray-300 to-zinc-300 text-gray-600',
                    'text-xs bg-gradient-to-b text-center rounded py-0.5 font-bold'
                  )}
                >
                  CLEAR
                </div>
                <div
                  className={classNames(
                    playlog.isHighScore
                      ? 'from-amber-400 to-yellow-400 text-gray-900'
                      : 'from-gray-300 to-zinc-300 text-gray-600',
                    'text-xs bg-gradient-to-b text-center rounded py-0.5 font-bold'
                  )}
                >
                  NEW RECORD
                </div>
                <div
                  className={classNames(
                    playlog.isFullCombo
                      ? 'from-amber-400 to-yellow-400 text-gray-900'
                      : 'from-gray-300 to-zinc-300 text-gray-600',
                    'text-xs bg-gradient-to-b text-center rounded py-0.5 font-bold'
                  )}
                >
                  FULL COMBO
                </div>
                <div
                  className={classNames(
                    playlog.isAllJustice
                      ? 'from-amber-400 to-yellow-400 text-gray-900'
                      : 'from-gray-300 to-zinc-300 text-gray-600',
                    'text-xs bg-gradient-to-b text-center rounded py-0.5 font-bold'
                  )}
                >
                  ALL JUSTICE
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
})
