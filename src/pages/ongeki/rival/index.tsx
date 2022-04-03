import { GetServerSideProps, NextPage } from 'next'

import { Navbar } from '../../../modules/ongeki/home/components/navbar'
import { RivalCard } from '../../../modules/ongeki/rival/components/rivalCard'

import { AppProps } from '../../../app/@types/AppProps'
import { Rival } from '../../../modules/ongeki/rival/@types/Rival'

interface Props extends AppProps {
  rivals: Rival[]
}

const Page: NextPage<Props> = props => {
  const { rivals } = props

  return (
    <div className="mt-4">
      <Navbar />
      <div className="space-y-4 max-w-xl mx-auto">
        {Array.from({ length: 3 }).map((_, i) => (
          <RivalCard
            key={`rival-${i}-${rivals[i]?.id ?? 'none'}`}
            rival={rivals[i]}
            mode="remove"
          />
        ))}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { getApiUserSession } = await import(
    '../../../core/services/authentication/api/getApiUserSession'
  )
  const { getUserRivals } = await import(
    '../../../modules/ongeki/rival/services/getUserRivals'
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

  const rivals = await getUserRivals(user.aimeCard)

  return {
    props: {
      user: {
        aime: user.aimeCard,
        eamuse: user.eamuseCard,
      },
      rivals,
    },
  }
}

export default Page
