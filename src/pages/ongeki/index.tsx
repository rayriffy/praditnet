import { GetServerSideProps, NextPage } from 'next'

import { ProfileCard } from '../../modules/ongeki/home/components/profileCard'
import { Navbar } from '../../modules/ongeki/home/components/navbar'

import { AppProps } from '../../app/@types/AppProps'
import { UserProfile } from '../../modules/ongeki/home/@types/UserProfile'

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
    '../../modules/ongeki/home/services/getUserProfile'
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

  const [userProfile] = await Promise.all([getUserProfile(user.card_luid)])

  return {
    props: {
      user: {
        cardId: user.card_luid,
      },
      profile: userProfile,
    },
  }
}

export default Page
