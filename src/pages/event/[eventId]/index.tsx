import { GetServerSideProps, NextPage } from 'next'

import dayjs from 'dayjs'

import { Image } from '../../../core/components/image'
import { capitalizeFirstCharacter } from '../../../core/services/capitalizeFirstCharacter'
import { Preview } from '../../../modules/event/home/components/preview'

interface Props {
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
  isStaff: boolean
  entry: {
    game: 'maimai' | 'chunithm'
    inGameName: string
    remainingAttempts: number
    attemptLog: [number, number][] // [musicId, score]
  } | null
}

const Page: NextPage<Props> = props => {
  const { event, musics, entry } = props

  return (
    <div className="space-y-4">
      <div className="flex justify-center items-center">
        <div className="bg-gradient-to-tr from-zinc-700 to-stone-800 p-4 rounded-xl">
          <div className="flex w-60">
            <Image
              src={`https://praditnet-cdn.rayriffy.com/event/${event.id}.png`}
              width={745}
              height={623}
            />
          </div>
        </div>
      </div>
      {entry === null ? (
        <Preview eventId={event.id} musics={musics} />
      ) : (
        <div>
          <div className="bg-gray-50 rounded-md px-5 py-4 block sm:flex sm:justify-between">
            <div className="flex justify-between sm:justify-start space-x-0 sm:space-x-4">
              <img
                src={`/assets/logo/${entry.game}.png`}
                className="w-40 h-auto"
              />
              <div className="flex items-center">
                <p className="py-1 px-6 font-semibold text-lg bg-white rounded-md">
                  {entry.inGameName}
                </p>
              </div>
            </div>
            <div className="flex items-center mt-2 justify-end sm:block">
              <p>Remaining attempts</p>
              <div className="ml-2 sm:ml-0 flex sm:mt-2 justify-start sm:justify-center">
                <p className="bg-white font-semibold text-lg rounded px-4 py-1">
                  {entry.remainingAttempts}
                </p>
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-3">
            Qualification progress
          </h1>
          <div className="grid grid-cols-1 gap-4">
            {musics[entry.game].map(music => (
              <div
                key={`music-${entry.game}-${music.id}`}
                className="flex bg-gray-50 p-4 rounded-md"
              >
                <div className="flex shrink-0 items-start">
                  <div className="flex rounded-md overflow-hidden w-28 sm:w-40">
                    <Image
                      src={`https://praditnet-cdn.rayriffy.com/${entry.game}/jacket/${music.id}.png`}
                      width={200}
                      height={200}
                    />
                  </div>
                </div>
                <div className="ml-4">
                  <h2 className="text-lg sm:text-2xl font-bold">
                    {music.name}
                  </h2>
                  <p className="mt-1 sm:mt-3 text-3xl sm:text-4xl font-light">
                    {entry.attemptLog.find(o => o[0] === music.id)?.[1] ?? 0}
                    {entry.game === 'maimai' && '%'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
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
      const musics = await knex('EventAuditionMusic')
        .where({
          eventId,
          gameId: game,
        })
        .join(
          `${capitalizeFirstCharacter(game)}Music`,
          'EventAuditionMusic.musicId',
          `${capitalizeFirstCharacter(game)}Music.id`
        )
        .select(
          `${capitalizeFirstCharacter(game)}Music.id as id`,
          `${capitalizeFirstCharacter(game)}Music.${
            game === 'chunithm' ? 'title' : 'name'
          } as name`,
          `EventAuditionMusic.level as targetDifficulty`,
          `${capitalizeFirstCharacter(game)}Music.level_expert`,
          `${capitalizeFirstCharacter(game)}Music.level_master`,
          ...(game === 'maimai'
            ? [`${capitalizeFirstCharacter(game)}Music.level_remaster`]
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

  let entry: Props['entry'] = null

  if (user !== null && user !== undefined) {
    // get user entry if exist
    const targetEntry = await knex('EventAuditionRegister')
      .where({
        eventId,
        userId: user.uid,
      })
      .first()

    if (targetEntry !== undefined) {
      // get attempt logs
      const attemptLogs = await knex('EventAuditionUser').where({
        eventId,
        userId: user.uid,
        gameId: targetEntry.selectedGameId,
      })

      entry = {
        game: targetEntry.selectedGameId,
        inGameName: targetEntry.inGameName,
        remainingAttempts: targetEntry.remainingAttempts,
        attemptLog: attemptLogs.map(item => [item.musicId, item.score]),
      }
    }
  }

  const eventStaff = await knex('EventStaff')
    .where({
      eventId,
      userId: user.uid,
    })
    .first()
  const isStaff = eventStaff !== undefined

  await knex.destroy()

  return {
    props: {
      event: {
        id: targetEvent.uid,
        name: targetEvent.name,
        startAt: dayjs(targetEvent.startAt).format('DD MMM YYYY'),
        endAt: dayjs(targetEvent.startAt).format('DD MMM YYYY'),
      },
      musics: Object.fromEntries(fetchedMusics),
      isStaff,
      entry,
    },
  }
}

export default Page
