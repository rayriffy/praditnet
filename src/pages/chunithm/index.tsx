import { Fragment } from 'react'

import { GetServerSideProps, NextPage } from 'next'

import { UserProfile } from '../../modules/chunithm/home/@types/UserProfile'
import { ProfileCard } from '../../modules/chunithm/home/components/profileCard'
import { Navbar } from '../../modules/chunithm/home/components/navbar'

interface Props {
  profile: UserProfile
}

const Page: NextPage<Props> = props => {
  const { profile } = props

  return (
    <div className="mt-4">
      <ProfileCard profile={profile} />
      <Navbar />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { getUserProfile } = await import(
    '../../modules/chunithm/home/services/getUserProfile'
  )

  const userProfile = await getUserProfile()

  return {
    props: {
      profile: userProfile,
    },
  }
}

export default Page
