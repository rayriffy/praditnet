import { Fragment, useRef } from 'react'

import { GetServerSideProps, NextPage } from 'next'

import ReCAPTCHA from 'react-google-recaptcha'

import { Navbar } from '../../../modules/ongeki/home/components/navbar'
import { Pagination } from '../../../core/components/pagination'
import { Card } from '../../../modules/ongeki/card/components/card'

import { AppProps } from '../../../app/@types/AppProps'
import { RarityOverview } from '../../../modules/ongeki/card/services/getOverviewCard'

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
  overview: RarityOverview
}

const Page: NextPage<Props> = props => {
  const { cards, page, overview } = props

  const recaptchaRef = useRef<ReCAPTCHA>(null)

  return (
    <Fragment>
      <div className="mt-4">
        <Navbar />
        <div className="grid grid-cols-3 sm:grid-cols-5 mx-auto max-w-md gap-2">
          {['n', 'r', 'sr', 'srp', 'ssr'].map(rarity => (
            <div
              key={`overview-${rarity}`}
              className="w-20 rounded-full bg-white border-2 border-pink-500 aspect-square flex flex-col items-center justify-center mx-auto"
            >
              <img
                src={`/assets/ongeki/cardRarity/${rarity}.png`}
                className="h-8 w-auto m-1"
              />
              <p className="font-medium text-gray-700 text-sm">
                {overview[rarity].owned} / {overview[rarity].total}
              </p>
            </div>
          ))}
        </div>
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
  const { getOverviewCard } = await import(
    '../../../modules/ongeki/card/services/getOverviewCard'
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

  const [cards, overview] = await Promise.all([
    getPaginatedCard(user.card_luid, paginatedPage),
    getOverviewCard(user.card_luid),
  ])

  return {
    props: {
      user: {
        cardId: user.card_luid,
      },
      page: cards.page,
      cards: cards.card,
      overview,
    },
  }
}

export default Page
