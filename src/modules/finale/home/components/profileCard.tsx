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
        <div className="flex bg-gradient-to-r from-purple-100 to-fuchsia-100 p-4 rounded-lg max-w-lg w-full">
          <img
            className="h-24 w-auto"
            src={`https://praditnet-cdn.rayriffy.com/finale/icon/${equipped.icon}.png`}
          />
          <div className="ml-4 h-full flex flex-col justify-between">
            <div>
              <h1 className="font-semibold text-xl text-gray-900">
                {displayName}
              </h1>
              <p className="text-gray-700">
                {rating.current.toFixed(2)} (MAX {rating.highest.toFixed(2)})
              </p>
            </div>
            <div className="h-10">
              <img
                className="h-full w-auto"
                src={`https://praditnet-cdn.rayriffy.com/finale/nameplate/${equipped.nameplate}.png`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
