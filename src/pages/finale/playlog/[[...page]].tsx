import { GetServerSideProps, NextPage } from 'next'

import { Navbar } from '../../../modules/finale/home/components/navbar'
import { PlaylogRenderer } from '../../../modules/finale/playlog/components/playlogRenderer'

import { UserPlaylog } from '../../../modules/finale/home/@types/UserPlaylog'
import { AppProps } from '../../../app/@types/AppProps'
import { useEffect } from 'react'
import { Pagination } from '../../../core/components/pagination'

interface Props extends AppProps {
  page: number
  maxPage: number
  playlogs: UserPlaylog[]
}

const Page: NextPage<Props> = props => {
  const { playlogs, page, maxPage } = props

  return (
    <div className="mt-4">
      <Navbar />
      <PlaylogRenderer playlogs={playlogs} />
      <Pagination urlPrefix="/finale/playlog" current={page} max={maxPage} />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { getPaginatedPlaylogs } = await import(
    '../../../modules/finale/playlog/services/getPaginatedPlaylogs'
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
