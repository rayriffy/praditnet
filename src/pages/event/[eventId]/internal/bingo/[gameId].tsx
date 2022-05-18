import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { CheckIcon } from '@heroicons/react/solid'

interface Props {
  musics: number[][]
}

const Page: NextPage<Props> = props => {
  const {
    musics: [chunk1, chunk2],
  } = props

  const router = useRouter()

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div
        className="bg-neutral-700 px-32 pt-20 pb-44 relative"
        style={{
          fontFamily: `'Exo 2'`,
        }}
      >
        <div className="grid grid-cols-5 overflow-hidden gap-4">
          {chunk1.map(music => (
            <div
              className="aspect-square relative rounded-xl overflow-hidden"
              key={`music-${music}`}
            >
              <img
                src={`http://localhost:8080/${router.query.gameId}/jacket/${music}.png`}
                className="w-full h-auto"
              />
              <div className="absolute bottom-3 right-3 w-12 h-12 bg-white rounded-lg border-4"></div>
            </div>
          ))}

          <div
            className="aspect-square text-white bg-white text-7xl font-semibold flex justify-center items-center relative rounded-xl overflow-hidden"
            style={{
              backgroundColor: '#fff',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23404040' fill-opacity='0.4'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          >
            <span className="leading-none bg-white text-neutral-700 px-4 py-2">
              FREE
            </span>
            <div className="absolute bottom-4 right-4 w-12 h-12 bg-blue-500 rounded-lg border-4"></div>
            <CheckIcon className="absolute bottom-4 right-4 w-12 h-12 z-20 text-white" />
          </div>

          {chunk2.map(music => (
            <div
              className="aspect-square relative rounded-xl overflow-hidden"
              key={`music-${music}`}
            >
              <img
                src={`http://localhost:8080/${router.query.gameId}/jacket/${music}.png`}
                className="w-full h-auto"
              />
              <div className="absolute bottom-3 right-3 w-12 h-12 bg-white rounded-lg border-4"></div>
            </div>
          ))}
        </div>
        <div className="absolute left-0 right-0 bottom-4 h-36 w-full flex justify-between px-32 items-center">
          <div className="space-x-4 h-36 flex items-center">
            <img
              src={`http://localhost:8080/event/${router.query.eventId}.png`}
              className="h-full w-auto"
            />
            <h1 className="text-white font-semibold text-5xl pl-6">
              Bingo -{' '}
              {router.query.gameId === 'maimai'
                ? 'maimai DX'
                : 'CHUNITHM NEW!!'}
            </h1>
          </div>
          <div className="rounded-lg bg-neutral-600 p-4 text-center">
            <h1 className="text-white text-4xl font-bold">
              CHUNIMAI Championship 2022
            </h1>
            <h2 className="text-white text-3xl font-medium">
              11th June 2022 @MBK Center
            </h2>
          </div>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { default: capitalize } = await import('lodash/capitalize')
  const { default: chunk } = await import('lodash/chunk')
  const { createKnexInstance } = await import(
    '../../../../../core/services/createKnexInstance'
  )

  const { eventId, gameId } = ctx.params

  const knex = createKnexInstance('praditnet')
  const musics = await knex('EventMusic')
    .join('EventPool', 'EventPool.uid', 'EventMusic.poolId')
    // .join(`${gameId}Music`, `${gameId}Music.id`, 'EventMusic.musicId')
    .orderByRaw('RAND()')
    .limit(24)
    .where('EventPool.eventId', eventId)
    .where('EventMusic.gameId', gameId)
    .where('EventPool.order', '>=', 1)
    .where('EventPool.order', '<=', 3)
    .select('EventMusic.musicId')
  await knex.destroy()

  return {
    props: {
      musics: chunk(
        musics.map(o => o.musicId),
        12
      ),
    },
  }
}

export default Page
