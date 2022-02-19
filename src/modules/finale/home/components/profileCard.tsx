import { memo } from 'react'

import { UserProfile } from '../@types/UserProfile'

interface Props {
  profile: UserProfile
}

export const ProfileCard = memo<Props>(props => {
  const { displayName } = props.profile

  return (
    <div>{displayName}</div>
  )
})
