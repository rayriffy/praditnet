import { GetServerSideProps, NextPage } from 'next'
import { useEffect } from 'react'

import { Navbar } from '../../../modules/chunithm/home/components/navbar'
import { PlaylogRenderer } from '../../../modules/chunithm/playlog/components/playlogRenderer'
import { Pagination } from '../../../modules/chunithm/playlog/components/pagination'

import { UserPlaylog } from '../../../modules/chunithm/playlog/@types/UserPlaylog'

interface Props {
  page: number
  maxPage: number
  playlogs: UserPlaylog[]
}

const Page: NextPage<Props> = props => {
  const { page, maxPage, playlogs } = props

  useEffect(() => {
    console.log(props)
  }, [])

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
    '../../../modules/chunithm/playlog/services/getPaginatedPlaylogs'
  )

  const { page = ['1'] } = ctx.params
  const paginatedPage = Number(page[0])

  const paginatedPlaylogs = await getPaginatedPlaylogs(paginatedPage)

  return {
    props: {
      page: paginatedPlaylogs.page,
      maxPage: paginatedPlaylogs.maxPage,
      playlogs: paginatedPlaylogs.playlogs,
    },
  }
}

export default Page
