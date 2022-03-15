import { Fragment, useRef } from 'react'

import { GetServerSideProps, NextPage } from 'next'

import ReCAPTCHA from 'react-google-recaptcha'

import { Navbar } from '../../../modules/ongeki/home/components/navbar'
import { Pagination } from '../../../core/components/pagination'
import { Card } from '../../../modules/ongeki/card/components/card'

import { AppProps } from '../../../app/@types/AppProps'

interface Props extends AppProps {
  page: {
    current: number
    max: number
  }
  cards: {
    id: number
    name: string
    serial: string
    owned: boolean
  }[]
}

const Page: NextPage<Props> = props => {
  const { cards, page } = props

  const recaptchaRef = useRef<ReCAPTCHA>(null)

  return (
    <Fragment>
      <div className="mt-4">
        <Navbar />
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {cards.map(card => (
            <Card
              key={`card-${card.id}`}
              card={card}
              recaptchaRef={recaptchaRef}
            />
          ))}
        </div>
        <Pagination
          firstLast
          urlPrefix="/ongeki/card"
          current={page.current}
          max={page.max}
        />
      </div>
      <ReCAPTCHA
        ref={recaptchaRef}
        size="invisible"
        sitekey={process.env.RECAPCHA_SITE_KEY}
      />
    </Fragment>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { getApiUserSession } = await import(
    '../../../core/services/authentication/api/getApiUserSession'
  )
  const { getPaginatedCard } = await import(
    '../../../modules/ongeki/card/services/getPaginatedCard'
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

  const cards = await getPaginatedCard(user.card_luid, paginatedPage)

  return {
    props: {
      user: {
        cardId: user.card_luid,
      },
      page: cards.page,
      cards: cards.card,
    },
  }
}

export default Page
