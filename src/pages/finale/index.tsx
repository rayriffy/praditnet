import { Fragment } from 'react'

import { GetServerSideProps, NextPage } from 'next'

import { ProfileCard } from '../../modules/finale/home/components/profileCard'

import { UserProfile } from '../../modules/finale/home/@types/UserProfile'

interface Props {
  profile: UserProfile
}

const Page: NextPage<Props> = props => {
  const { profile } = props
  return (
    <Fragment>
      <ProfileCard profile={profile} />
    </Fragment>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const { getUserProfile } = await import(
    '../../modules/finale/home/services/getUserProfile'
  )

  const userProfile = await getUserProfile()

  return {
    props: {
      profile: userProfile,
    },
  }
}

export default Page
