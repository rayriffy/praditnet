import dayjs from 'dayjs'
import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import { AppProps } from '../../../app/@types/AppProps'
import { Image } from '../../../core/components/image'
import { classNames } from '../../../core/services/classNames'

interface Props extends AppProps {
  event: {
    id: string
    name: string
    startAt: string
    endAt: string
  }
  musics: {
    [key: string]: {
      id: number
      name: string
      artist: string
      level: string
      difficulty: number
    }[]
  }
  entry: {
    game: 'maimai' | 'chunithm'
    remainingAttempts: number
    attemptLog: {}
  } | null
}

const Page: NextPage<Props> = props => {
  const { event, musics } = props

  return (
    <div className="space-y-4">
      <div className="flex justify-center items-center">
        <div className="bg-gradient-to-tr from-zinc-700 to-stone-800 p-4 rounded-xl">
          <img src={`/assets/event/${event.id}.png`} className="w-60 h-auto" />
        </div>
      </div>
      <div className="border-4 border-dashed p-6 rounded-lg">
        <h1 className="text-center font-bold text-lg text-gray-900 mb-2">
          You're not registered for competition yet!
        </h1>
        <div className="flex justify-center">
          <Link href={`/event/${event.id}/apply`}>
            <a className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Apply now
            </a>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(musics).map(([game, musics]) => (
          <div
            key={`music-grid-${game}`}
            className="bg-gray-100 rounded-md mt-14 px-6 pb-4"
          >
            <img
              src={`/assets/logo/${game}.png`}
              className={classNames(
                game === 'maimai' ? 'w-56' : 'w-64',
                'h-auto mx-auto -mt-12'
              )}
            />
            <h1 className="font-bold text-xl my-2">Qualifying songs</h1>
            <div className="my-2 grid grid-cols-2 items-start gap-6">
              {musics.map(music => (
                <div
                  key={`music-${game}-${music.id}`}
                  className="flex flex-col justify-center items-center"
                >
                  <div className="rounded overflow-hidden flex">
                    <Image
                      src={`https://praditnet-cdn.rayriffy.com/${game}/jacket/${music.id}.png`}
                      width={200}
                      height={200}
                    />
                  </div>
                  <p className="text-gray-900 text-sm font-bold text-center mt-2">
                    {music.name}
                  </p>
                  <div className="flex mt-2">
                    <div
                      className={classNames(
                        music.level === 'remaster'
                          ? 'bg-purple-200'
                          : music.level === 'master'
                          ? 'bg-purple-500'
                          : music.level === 'expert'
                          ? 'bg-red-500'
                          : music.level === 'advanced'
                          ? 'bg-orange-500'
                          : music.level === 'basic'
                          ? 'bg-emerald-500'
                          : 'bg-pink-500',
                        music.level === 'remaster'
                          ? 'text-purple-700'
                          : 'text-white',
                        'px-2 py-1 text-xs uppercase rounded flex items-center'
                      )}
                    >
                      <p>{music.level}</p>
                      <p
                        className={classNames(
                          music.level === 'remaster'
                            ? 'bg-purple-500 text-white'
                            : music.level === 'master'
                            ? 'bg-purple-400'
                            : music.level === 'expert'
                            ? 'bg-red-400'
                            : music.level === 'advanced'
                            ? 'bg-orange-400'
                            : music.level === 'basic'
                            ? 'bg-emerald-400'
                            : 'bg-gradient-to-tr from-red-500 to-gray-700',
                          'text-sm mx-auto rounded text-center px-3 ml-2'
                        )}
                      >
                        {Math.floor(music.difficulty)}
                        {Number(
                          music.difficulty.toFixed(1).split('.').reverse()[0]
                        ) >= 7
                          ? '+'
                          : ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { createKnexInstance } = await import(
    '../../../core/services/createKnexInstance'
  )
  const { getApiUserSession } = await import(
    '../../../core/services/authentication/api/getApiUserSession'
  )

  const eventId = ctx.params.eventId as string

  const user = await getApiUserSession(ctx.req)
  if (user === null || user === undefined) {
    return {
      redirect: {
        statusCode: 302,
        destination: '/login',
      },
    }
  }

  const knex = createKnexInstance('praditnet')

  // get event information
  const targetEvent = await knex('Event')
    .where({
      uid: eventId,
    })
    .first()

  if (targetEvent === undefined) {
    await knex.destroy()

    return {
      notFound: true,
    }
  }

  // get musics information
  const availableGames = targetEvent.availableGames.split(',')
  const fetchedMusics = await Promise.all(
    availableGames.map(async game => {
      const musics = await knex('EventMusicAudition')
        .where({
          eventId,
          gameId: game,
        })
        .join(
          `aqua.praditnet_${game}_music`,
          'EventMusicAudition.musicId',
          `aqua.praditnet_${game}_music.id`
        )
        .select(
          `aqua.praditnet_${game}_music.id as id`,
          `aqua.praditnet_${game}_music.${
            game === 'chunithm' ? 'title' : 'name'
          } as name`,
          `EventMusicAudition.level as targetDifficulty`,
          `aqua.praditnet_${game}_music.level_expert`,
          `aqua.praditnet_${game}_music.level_master`,
          ...(game === 'maimai'
            ? [`aqua.praditnet_${game}_music.level_remaster`]
            : [])
        )

      return [
        game,
        musics.map(music => ({
          id: music.id,
          name: music.name,
          level: music.targetDifficulty,
          difficulty: music[`level_${music.targetDifficulty}`],
        })),
      ]
    })
  )

  await knex.destroy()

  const entry = null

  return {
    props: {
      user: {
        cardId: user.card_luid,
      },
      event: {
        id: targetEvent.uid,
        name: targetEvent.name,
        startAt: dayjs(targetEvent.startAt).format('DD MMM YYYY'),
        endAt: dayjs(targetEvent.startAt).format('DD MMM YYYY'),
      },
      musics: Object.fromEntries(fetchedMusics),
      entry,
    },
  }
}

export default Page
