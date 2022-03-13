import { memo } from 'react'

import { Image } from '../../../../core/components/image'

import { UserProfile } from '../@types/UserProfile'
import { Trophy } from './trophy'

interface Props {
  profile: UserProfile
}

export const ProfileCard = memo<Props>(props => {
  const { displayName, equipped, rating } = props.profile

  return (
    <div>
      <div className="flex justify-center">
        <div className="flex bg-gradient-to-r from-amber-100 to-yellow-100 p-4 rounded-lg max-w-lg w-full">
          <div className="shrink-0 flex items-center">
            <div className="bg-gray-50 border-2 border-gray-700 rounded-md overflow-hidden shadow">
              <Image
                className="h-24 w-auto"
                src={`https://praditnet-cdn.rayriffy.com/chunithm/character/icon/${equipped.character}.png`}
                width={96}
                height={96}
              />
            </div>
          </div>
          <div className="ml-4 w-full">
            <Trophy {...equipped.trophy} />
            <h1 className="font-semibold text-xl text-gray-900 mt-1.5">
              {displayName}
            </h1>
            <p className="text-gray-700">
              {rating.current.toFixed(2)} (MAX {rating.highest.toFixed(2)})
            </p>
          </div>
        </div>
      </div>
    </div>
  )
})
