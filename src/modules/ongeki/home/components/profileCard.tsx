import { memo } from 'react'

import { Image } from '../../../../core/components/image'

import { UserProfile } from '../@types/UserProfile'
import { Trophy } from './trophy'

interface Props {
  profile: UserProfile
}

export const ProfileCard = memo<Props>(props => {
  const { displayName, equipped, rating, level, playCount, lastPlayed } =
    props.profile

  return (
    <div>
      <div className="flex justify-center">
        <div className="flex bg-gradient-to-r from-slate-100 dark:from-slate-200 to-gray-100 dark:to-gray-200 p-4 rounded-lg max-w-lg w-full">
          <div className="shrink-0 flex items-center">
            <div className="bg-gray-50 border-2 border-gray-700 rounded-md overflow-hidden shadow aspect-square">
              <Image
                className="h-24 w-auto"
                src={`https://cdn.pradit.net/ongeki/card/icon/${equipped.card}.png`}
                width={96}
                height={96}
              />
            </div>
          </div>
          <div className="ml-4 flex flex-col justify-between h-full w-full">
            <div>
              {/* <Trophy {...equipped.trophy} /> */}
              <h1 className="font-semibold text-2xl text-gray-900 mt-1.5">
                <span className="mr-3 text-lg">
                  Lv.<span className="text-xl">{level}</span>
                </span>
                {displayName}
              </h1>
              <p className="text-gray-700 text-sm">
                Rating {rating.current.toFixed(2)} (MAX{' '}
                {rating.highest.toFixed(2)})
              </p>
            </div>
            <div className="text-gray-800 text-sm grid grid-cols-1 md:grid-cols-3 mt-2">
              <p>
                Play count{' '}
                <span className="font-semibold ml-1">
                  {playCount.toLocaleString()}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
