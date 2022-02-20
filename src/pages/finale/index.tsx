import { GetServerSideProps, NextPage } from 'next'

import { ProfileCard } from '../../modules/finale/home/components/profileCard'
import { Navbar } from '../../modules/finale/home/components/navbar'

import { UserProfile } from '../../modules/finale/home/@types/UserProfile'

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
    '../../modules/finale/home/services/getUserProfile'
  )

  const userProfile = await getUserProfile()

  ctx.res.setHeader('Cache-Control', 'max-age=300, public')

  return {
    props: {
      profile: userProfile,
    },
  }
}

export default Page
