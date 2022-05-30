import { GetServerSideProps, NextPage } from 'next'
import dynamic from 'next/dynamic'

import { GameTabsProps } from '../../../modules/event/leaderboard/components/gameTabs'

const GameTabs = dynamic<GameTabsProps>(
  () =>
    import('../../../modules/event/leaderboard/components/gameTabs').then(
      o => o.GameTabs
    ),
  { ssr: false }
)

interface Props {
  event: {
    id: string
    games: string[]
  }
}

const Page: NextPage<Props> = props => {
  return (
    <div>
      <h1 className="font-bold text-3xl my-4">Leaderboard</h1>
      <div>
        <GameTabs {...props} />
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { createKnexInstance } = await import(
    '../../../core/services/createKnexInstance'
  )

  const eventId = ctx.params.eventId as string

  const knex = createKnexInstance('praditnet')

  // get event information
  const targetEvent = await knex('Event')
    .where({
      uid: eventId,
    })
    .first()
  await knex.destroy()

  if (targetEvent === undefined) {
    return {
      notFound: true,
    }
  } else {
    return {
      props: {
        event: {
          id: targetEvent.uid,
          games: targetEvent.availableGames.split(',').map(o => o.trim()),
        },
      },
    }
  }
}

export default Page
