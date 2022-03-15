import { memo } from 'react'
import { Image } from '../../../../core/components/image'

import { classNames } from '../../../../core/services/classNames'

import { judges } from '../constants/judges'

import { UserPlaylog } from '../@types/UserPlaylog'
import { toNamespacedPath } from 'path'

// import { judges } from '../constants/judges'
// import { ranks } from '../constants/ranks'

interface Props {
  playlogs: UserPlaylog[]
}

export const PlaylogRenderer = memo<Props>(props => {
  const { playlogs } = props

  return (
    <div className="grid grid-cols-1 gap-6">
      {playlogs.map(playlog => (
        <div
          className="p-4 md:p-6 bg-gradient-to-r from-slate-100 to-gray-100 dark:from-neutral-700 dark:to-stone-700 rounded-xl"
          key={`playlog-${playlog.id}`}
        >
          <div className="sm:flex">
            <div className="mx-auto mb-4 sm:m-0 w-60 md:w-48 shrink-0 flex items-start">
              <Image
                src={`https://praditnet-cdn.rayriffy.com/ongeki/jacket/${playlog.music.id}.png`}
                width={300}
                height={300}
                className="w-full h-auto rounded"
              />
            </div>
            <div className="sm:ml-6 w-full mt-4 sm:mt-0">
              <div className="flex flex-row sm:flex-col-reverse justify-between items-start">
                <div>
                  <h1 className="font-bold text-2xl text-gray-900 dark:text-white mr-4 mt-0 sm:mt-2">
                    {playlog.music.name}
                  </h1>
                  <p className="text-gray-700 text-sm">{playlog.playDate}</p>
                </div>

                <div
                  className={classNames(
                    playlog.difficulty === 'master'
                      ? 'bg-purple-500'
                      : playlog.difficulty === 'expert'
                      ? 'bg-red-500'
                      : playlog.difficulty === 'advanced'
                      ? 'bg-orange-500'
                      : playlog.difficulty === 'basic'
                      ? 'bg-emerald-500'
                      : playlog.difficulty === 'lunatic'
                      ? 'bg-gradient-to-tr from-slate-200 to-neutral-200'
                      : 'bg-white',
                    'p-2 text-white text-xs uppercase rounded flex items-center'
                  )}
                >
                  <p
                    className={classNames(
                      playlog.difficulty === 'lunatic' ? 'text-gray-900' : ''
                    )}
                  >
                    {playlog.difficulty}
                  </p>
                  <p
                    className={classNames(
                      playlog.difficulty === 'master'
                        ? 'bg-purple-400'
                        : playlog.difficulty === 'expert'
                        ? 'bg-red-400'
                        : playlog.difficulty === 'advanced'
                        ? 'bg-orange-400'
                        : playlog.difficulty === 'basic'
                        ? 'bg-emerald-400'
                        : 'bg-gradient-to-tr from-red-500 to-rose-700',
                      'text-sm mx-auto rounded text-center px-3 ml-2'
                    )}
                  >
                    {playlog.level}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 my-2 items-start">
                <div className="bg-gray-50 shadow-sm rounded-md relative">
                  <h1 className="text-xs uppercase font-bold bg-neutral-600 rounded-t-md text-white py-1 px-2">
                    Battle
                  </h1>
                  <div className="px-3 py-2">
                    <div className="flex justify-center">
                      <div>
                        {playlog.battle.newRecord && (
                          <span className="text-red-500 text-xs sm:text-sm">
                            New record!!
                          </span>
                        )}
                        <h2
                          className={classNames(
                            playlog.tech.newRecord ? '-mt-1' : '',
                            'text-2xl sm:text-3xl font-light mb-1'
                          )}
                        >
                          {playlog.battle.score.toLocaleString()}
                        </h2>
                      </div>
                    </div>
                    <table className="text-sm">
                      <tr>
                        <td className="pr-2.5">Damage</td>
                        <td className="font-semibold">
                          {(playlog.overDamage.damage / 100).toFixed(2)}%
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
                <div className="bg-gray-50 shadow-sm rounded-md overflow-hidden">
                  <h1 className="text-xs uppercase font-bold bg-neutral-600 text-white py-1 px-2">
                    Technical
                  </h1>
                  <div className="px-3 py-2">
                    <div className="flex justify-center">
                      <div>
                        {playlog.tech.newRecord && (
                          <span className="text-red-500 text-xs sm:text-sm">
                            New record!!
                          </span>
                        )}
                        <h2
                          className={classNames(
                            playlog.tech.newRecord ? '-mt-1' : '',
                            'text-2xl sm:text-3xl font-light mb-1'
                          )}
                        >
                          {playlog.tech.score.toLocaleString()}
                        </h2>
                      </div>
                    </div>
                    <table className="text-sm">
                      {judges.map(judge => (
                        <tr key={`playlog-${playlog.id}-judge-${judge.id}`}>
                          <td className="pr-2.5">{judge.name}</td>
                          <td className="font-semibold">
                            {playlog.judge[judge.id].toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </table>
                    {playlog.judge.damage !== 0 && (
                      <div className="flex text-xs py-0.5 px-2 justify-between items-center bg-rose-500 text-white rounded mt-2">
                        <h2 className="uppercase font-semibold">Damage</h2>
                        <p>{playlog.judge.damage}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-0 sm:gap-4">
            {playlog.cards.map(card => (
              <Image
                key={`card-${card.id}`}
                src={`https://praditnet-cdn.rayriffy.com/ongeki/card/full/${card.id}.png`}
                width={384}
                height={526}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
})
