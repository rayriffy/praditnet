import { memo } from 'react'

import { UserProfile } from '../@types/UserProfile'

interface Props {
  profile: UserProfile
}

export const ProfileCard = memo<Props>(props => {
  const { displayName, equipped, rating } = props.profile

  return (
    <div>
      <div className="flex justify-center">
        <div className="flex bg-gradient-to-r from-amber-100 to-yellow-100 p-4 rounded-lg max-w-lg w-full">
          <div className="bg-gray-50 border-2 border-gray-700 rounded-md overflow-hidden shadow">
            <img
              className="h-24 w-auto"
              src={`https://praditnet-cdn.rayriffy.com/chunithm/character/${equipped.character}.png`}
            />
          </div>
          <div className="ml-4 h-full flex flex-col justify-between">
            <div>
              <h1 className="font-semibold text-xl text-gray-900">
                {displayName}
              </h1>
              <p className="text-gray-700">
                {rating.current.toFixed(2)} (MAX {rating.highest.toFixed(2)})
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
