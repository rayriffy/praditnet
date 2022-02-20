import { memo } from 'react'

import { classNames } from '../../../../core/services/classNames'

import { UserPlaylog } from '../@types/UserPlaylog'
import { judges } from '../constants/judges'

interface Props {
  playlogs: UserPlaylog[]
}

export const PlaylogRenderer = memo<Props>(props => {
  const { playlogs } = props

  return (
    <div className="grid grid-cols-1 gap-6">
      {playlogs.map(playlog => (
        <div
          className="p-4 md:p-6 bg-gradient-to-r from-slate-100 to-gray-100 rounded-xl flex"
          key={`playlog-${playlog.id}`}
        >
          <div className="w-28 md:w-48 shrink-0 flex items-start">
            <img
              className="w-full h-auto rounded"
              src={`https://praditnet-cdn.rayriffy.com/chunithm/jacket/${playlog.musicId}.png`}
              loading="lazy"
            />
          </div>
          <div className="ml-6 w-full">
            <h1 className="font-bold text-2xl text-gray-900 break-all">
              {playlog.musicTitle}
            </h1>
            <p className="py-2 text-2xl md:text-4xl font-light">
              {playlog.score.toLocaleString()}
            </p>
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                <div
                  className={classNames(
                    playlog.isFullCombo
                      ? 'from-amber-400 to-yellow-500 text-gray-900'
                      : 'from-gray-300 to-zinc-300 text-gray-600',
                    'text-xs bg-gradient-to-b text-center rounded py-0.5 font-bold'
                  )}
                >
                  FULL COMBO
                </div>
                <div
                  className={classNames(
                    playlog.isAllJustice
                      ? 'from-amber-400 to-yellow-500 text-gray-900'
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
