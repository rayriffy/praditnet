import { Fragment, useRef } from 'react'

import { GetServerSideProps, NextPage } from 'next'

import { Navbar } from '../../../modules/ongeki/home/components/navbar'
import { RivalCard } from '../../../modules/ongeki/rival/components/rivalCard'

import { AppProps } from '../../../app/@types/AppProps'
import { Rival } from '../../../modules/ongeki/rival/@types/Rival'

interface Props extends AppProps {
  isSlotFull: boolean
  availableRivals: Rival[]
}

const Page: NextPage<Props> = props => {
  const { isSlotFull, availableRivals } = props

  return (
    <Fragment>
      <div className="mt-4">
        <Navbar />
        <div className="space-y-4 max-w-xl mx-auto">
          {availableRivals.map(rival => (
            <RivalCard key={`rival-${rival.id}`} rival={rival} mode="add" />
          ))}
        </div>
      </div>
    </Fragment>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { getApiUserSession } = await import(
    '../../../core/services/authentication/api/getApiUserSession'
  )
  const { getRivalsList } = await import(
    '../../../modules/ongeki/rival/services/getRivalsList'
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

  const response = await getRivalsList(user.aimeCard)

  return {
    props: {
      user: {
        aime: user.aimeCard,
        eamuse: user.eamuseCard,
      },
      ...response,
    },
  }
}

export default Page
