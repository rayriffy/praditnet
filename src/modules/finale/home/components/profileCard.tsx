import { memo } from 'react'

import { Image } from '../../../../core/components/image'

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
          <Image
            className="h-24 w-full"
            src={`https://praditnet-cdn.rayriffy.com/finale/icon/${equipped.icon}.png`}
            width={96}
            height={96}
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
              <Image
                className="h-full w-auto"
                layout="responsive"
                src={`https://praditnet-cdn.rayriffy.com/finale/nameplate/${equipped.nameplate}.png`}
                width={284}
                height={96}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
