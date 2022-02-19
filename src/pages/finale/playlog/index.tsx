import { Fragment } from 'react'

import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'

import { Navbar } from '../../../modules/finale/home/components/navbar'
import { PlaylogRenderer } from '../../../modules/finale/playlog/components/playlogRenderer'
import { Pagination } from '../../../modules/finale/playlog/components/pagination'

import { UserPlaylog } from '../../../modules/finale/home/@types/UserPlaylog'

interface Props {
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
      <Pagination current={page} max={maxPage} />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const { getPaginatedPlaylogs } = await import('../../../modules/finale/playlog/services/getPaginatedPlaylogs')

  const paginatedPlaylogs = await getPaginatedPlaylogs()

  return {
    props: {
      page: paginatedPlaylogs.page,
      maxPage: paginatedPlaylogs.maxPage,
      playlogs: paginatedPlaylogs.playlogs,
    },
  }
}

export default Page
