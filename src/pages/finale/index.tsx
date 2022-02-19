import { Fragment } from 'react'

import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'

import { ProfileCard } from '../../modules/finale/home/components/profileCard'

import { UserProfile } from '../../modules/finale/home/@types/UserProfile'

interface Props {
  profile: UserProfile
}

const navbars = [
  {
    id: 'playlog',
    title: 'Playlog',
  },
]

const Page: NextPage<Props> = props => {
  const { profile } = props
  return (
    <div className="mt-4">
      <ProfileCard profile={profile} />
      <div className="grid grid-cols-4 gap-6 mt-2">
        {navbars.map(navbar => (
          <Link href={`/finale/${navbar.id}`}>
            <a
              key={`finale-navbar-${navbar.id}`}
              className="border text-gray-900 hover:bg-gray-50 hover:text-gray-900 py-2 px-4 rounded-lg font-medium text-sm text-center"
            >
              {navbar.title}
            </a>
          </Link>
        ))}
      </div>
    </div>
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
