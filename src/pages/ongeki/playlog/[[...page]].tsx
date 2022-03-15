import { GetServerSideProps, NextPage } from 'next'

import { Navbar } from '../../../modules/ongeki/home/components/navbar'
import { PlaylogRenderer } from '../../../modules/ongeki/playlog/components/playlogRenderer'
import { Pagination } from '../../../modules/ongeki/playlog/components/pagination'

import { UserPlaylog } from '../../../modules/ongeki/playlog/@types/UserPlaylog'
import { AppProps } from '../../../app/@types/AppProps'

interface Props extends AppProps {
  page: number
  maxPage: number
  playlogs: UserPlaylog[]
}

const Page: NextPage<Props> = props => {
  const { page, maxPage, playlogs } = props

  return (
    <div className="mt-4">
      <Navbar />
      <PlaylogRenderer playlogs={playlogs} />
      <Pagination current={page} max={maxPage} />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { getPaginatedPlaylogs } = await import(
    '../../../modules/ongeki/playlog/services/getPaginatedPlaylogs'
  )
  const { getApiUserSession } = await import(
    '../../../core/services/authentication/api/getApiUserSession'
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

  const { page = ['1'] } = ctx.params
  const paginatedPage = Number(page[0])

  const paginatedPlaylogs = await getPaginatedPlaylogs(
    user.card_luid,
    paginatedPage
  )

  return {
    props: {
      user: {
        cardId: user.card_luid,
      },
      page: paginatedPlaylogs.page,
      maxPage: paginatedPlaylogs.maxPage,
      playlogs: paginatedPlaylogs.playlogs,
    },
  }
}

export default Page
