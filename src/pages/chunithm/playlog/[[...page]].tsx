import { GetServerSideProps, NextPage } from 'next'

import { Pagination } from '../../../core/components/pagination'
import { Navbar } from '../../../modules/chunithm/home/components/navbar'
import { PlaylogRenderer } from '../../../modules/chunithm/playlog/components/playlogRenderer'

import { UserPlaylog } from '../../../modules/chunithm/playlog/@types/UserPlaylog'
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
      <Pagination urlPrefix="/chunithm/playlog" current={page} max={maxPage} />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { getPaginatedPlaylogs } = await import(
    '../../../modules/chunithm/playlog/services/getPaginatedPlaylogs'
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
    user.aimeCard,
    paginatedPage
  )

  return {
    props: {
      user: {
        aime: user.aimeCard,
        eamuse: user.eamuseCard,
      },
      page: paginatedPlaylogs.page,
      maxPage: paginatedPlaylogs.maxPage,
      playlogs: paginatedPlaylogs.playlogs,
    },
  }
}

export default Page
