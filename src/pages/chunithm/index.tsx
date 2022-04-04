import { Fragment } from 'react'

import { GetServerSideProps, NextPage } from 'next'

import { Image } from '../../core/components/image'
import { ProfileCard } from '../../modules/chunithm/home/components/profileCard'
import { Navbar } from '../../modules/chunithm/home/components/navbar'

import { UserProfile } from '../../modules/chunithm/home/@types/UserProfile'
import { AppProps } from '../../app/@types/AppProps'

interface Props extends AppProps {
  profile: UserProfile
}

const Page: NextPage<Props> = props => {
  const { profile } = props

  return (
    <div className="mt-4">
      <ProfileCard profile={profile} />
      <Navbar />
      <div className="mt-4 flex justify-center">
        <Image
          src={`https://cdn.pradit.net/chunithm/character/deka/${profile.equipped.character}.png`}
          width={500}
          height={500}
        />
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { getUserProfile } = await import(
    '../../modules/chunithm/home/services/getUserProfile'
  )
  const { getApiUserSession } = await import(
    '../../core/services/authentication/api/getApiUserSession'
  )

  // check for user session
  const user = await getApiUserSession(ctx.req)

  if (user === null || user === undefined) {
    return {
      redirect: {
        statusCode: 302,
        destination: '/login',
      },
    }
  }

  const userProfile = await getUserProfile(user.aimeCard)

  return {
    props: {
      user: {
        aime: user.aimeCard,
        eamuse: user.eamuseCard,
      },
      profile: userProfile,
    },
  }
}

export default Page
