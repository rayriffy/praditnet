import { memo } from 'react'
import { classNames } from '../../../../core/services/classNames'

import { Image } from '../../../../core/components/image'

import { ranks } from '../../../finale/playlog/constants/ranks'

import { UserPlaylog } from '../../home/@types/UserPlaylog'
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
          className="p-4 md:p-6 bg-gradient-to-r from-slate-100 to-gray-100 dark:from-neutral-700 dark:to-stone-700 rounded-xl sm:flex"
          key={`playlog-${playlog.id}`}
        >
          <div className="mx-auto mb-4 sm:m-0 w-60 md:w-48 shrink-0 flex items-start">
            <Image
              className="w-full h-auto rounded"
              src={`https://cdn.pradit.net/finale/jacket/${playlog.musicId}.png`}
              width={256}
              height={256}
            />
          </div>
          <div className="sm:ml-6 w-full mt-3">
            <div className="flex flex-row sm:flex-col-reverse justify-between items-start">
              <h1 className="font-bold text-2xl text-gray-900 dark:text-white mr-4 mt-0 sm:mt-2">
                {playlog.musicTitle}
              </h1>

              <div
                className={classNames(
                  playlog.scoreDifficulty === 'remaster'
                    ? 'bg-purple-200'
                    : playlog.scoreDifficulty === 'master'
                    ? 'bg-purple-500'
                    : playlog.scoreDifficulty === 'expert'
                    ? 'bg-red-500'
                    : playlog.scoreDifficulty === 'advanced'
                    ? 'bg-orange-500'
                    : playlog.scoreDifficulty === 'basic'
                    ? 'bg-emerald-500'
                    : 'bg-pink-500',
                  playlog.scoreDifficulty === 'remaster'
                    ? 'text-purple-700'
                    : 'text-white',
                  'p-2 text-xs uppercase rounded flex items-center'
                )}
              >
                <p>{playlog.scoreDifficulty}</p>
                {playlog.scoreDifficulty !== 'utage' && (
                  <p
                    className={classNames(
                      playlog.scoreDifficulty === 'remaster'
                        ? 'bg-purple-500 text-white'
                        : playlog.scoreDifficulty === 'master'
                        ? 'bg-purple-400'
                        : playlog.scoreDifficulty === 'expert'
                        ? 'bg-red-400'
                        : playlog.scoreDifficulty === 'advanced'
                        ? 'bg-orange-400'
                        : playlog.scoreDifficulty === 'basic'
                        ? 'bg-emerald-400'
                        : 'bg-gradient-to-tr from-red-500 to-gray-700',
                      'text-sm mx-auto rounded text-center px-3 ml-2'
                    )}
                  >
                    {playlog.scoreLevel}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                {playlog.isHighScore && (
                  <p className="text-sm text-rose-500 tracking-wider">
                    New Record!!
                  </p>
                )}
                <p className="pb-2 text-4xl font-light dark:text-white">
                  {playlog.achievement.toFixed(2)}%
                </p>
                <p className="text-gray-700 text-sm dark:text-gray-300">
                  Track {playlog.track} · {playlog.playDate}
                </p>
              </div>
              <img
                className="w-32"
                src={`/assets/finale/rank/${
                  ranks.find(rank => rank.score <= playlog.achievement).id
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
            </div>
          </div>
        </div>
      ))}
    </div>
  )
})
