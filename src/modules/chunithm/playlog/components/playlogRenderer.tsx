import { memo } from 'react'
import { DifficultyBlock } from '../../../../core/components/difficultyBlock'
import { Image } from '../../../../core/components/image'

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
          className="p-4 md:p-6 bg-gradient-to-r from-slate-100 to-gray-100 rounded-xl sm:flex"
          key={`playlog-${playlog.id}`}
        >
          <div className="mx-auto mb-4 sm:m-0 w-60 md:w-48 shrink-0 flex items-start">
            <Image
              src={`https://cdn.pradit.net/chunithm/jacket/${playlog.musicId}.png`}
              width={300}
              height={300}
              className="w-full h-auto rounded"
            />
          </div>
          <div className="sm:ml-6 w-full mt-4 sm:mt-0">
            <div className="flex flex-row sm:flex-col-reverse justify-between items-start">
              <h1 className="font-bold text-2xl text-gray-900 mr-4 mt-0 sm:mt-2">
                {playlog.musicTitle}
              </h1>

              <DifficultyBlock
                difficulty={playlog.level}
                level={playlog.difficulty}
              />
            </div>
            <div className="flex justify-between items-center">
              <div>
                {playlog.isHighScore && (
                  <p className="text-sm text-rose-500 tracking-wider">
                    New Record!!
                  </p>
                )}
                <p className="pb-2 text-4xl font-light">
                  {playlog.score.toLocaleString()}
                </p>
                <p className="text-gray-700 text-sm">
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
                    playlog.isFullChain
                      ? 'from-amber-400 to-yellow-400 text-gray-900'
                      : 'from-gray-300 to-zinc-300 text-gray-600',
                    'text-xs bg-gradient-to-b text-center rounded py-0.5 font-bold'
                  )}
                >
                  FULL CHAIN
                </div>
                <div
                  className={classNames(
                    playlog.isAllJustice
                      ? 'bg-gradient-to-r from-sky-300 via-rose-300 to-lime-300 text-black'
                      : 'bg-gradient-to-b from-gray-300 to-zinc-300 text-gray-600',
                    'text-xs text-center rounded py-0.5 font-bold'
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
