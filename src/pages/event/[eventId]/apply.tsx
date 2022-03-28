import dayjs from 'dayjs'
import { GetServerSideProps, NextPage } from 'next'

import { AppProps } from '../../../app/@types/AppProps'

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

const Page: NextPage = props => {
  return <>OK</>
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
