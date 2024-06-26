import { GetServerSideProps, NextPage } from 'next'

import { ProfileCard } from '../../modules/finale/home/components/profileCard'
import { Navbar } from '../../modules/finale/home/components/navbar'

import { UserProfile } from '../../modules/finale/home/@types/UserProfile'
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
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { getUserProfile } = await import(
    '../../modules/finale/home/services/getUserProfile'
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
