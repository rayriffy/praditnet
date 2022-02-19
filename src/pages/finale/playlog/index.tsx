import { Fragment } from 'react'

import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'

import { UserPlaylog } from '../../../modules/finale/home/@types/UserPlaylog'

interface Props {
  page: number
  maxPage: number
  playlogs: UserPlaylog[]
}

const Page: NextPage<Props> = props => {
  const { playlogs } = props

  return (
    <div className="mt-4">
      <div className="grid grid-cols-1 gap-6">
        {playlogs.map(playlog => (
          <div className="p-4 md:p-6 bg-slate-100 rounded-xl flex">
            <img className="w-32 md:w-48 h-auto rounded" src={`https://praditnet-cdn.rayriffy.com/finale/jacket/${playlog.musicId}.png`} loading="lazy" />
            <div className="ml-6">
              <h1 className="font-semibold text-2xl text-gray-900">{playlog.musicTitle}</h1>
              <p className="py-2 text-3xl">{playlog.achievement.toFixed(2)}%</p>
            </div>
          </div>
        ))}
      </div>
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
