import { GetServerSideProps, NextPage } from 'next'

import { Image } from '../../../../core/components/image'
import { Navbar } from '../../../../modules/ongeki/home/components/navbar'

import { AppProps } from '../../../../app/@types/AppProps'
import { Deck } from '../../../../modules/ongeki/deck/@types/Deck'

interface Props extends AppProps {
  deck: Deck
}

const Page: NextPage<Props> = props => {
  const { deck } = props

  return (
    <div className="mt-4">
      <Navbar />
      <div className="mt-4 space-y-4 sm:space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Editing deck {deck.id}
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
          {deck.cards.map(card => (
            <div key={`deck-${deck.id}-card-${card.id}`}>
              <div className="flex mx-0 sm:mx-1.5 -mb-1.5 h-5 sm:h-6">
                <div className="w-0 h-0 border-t-[1.25rem] sm:border-t-[1.5rem] border-r-[1.25rem] sm:border-r-[1.5rem] border-t-transparent border-r-slate-50" />
                <div className="w-full bg-slate-50 text-xs flex items-center justify-center px-1">
                  <p className="text-sky-500">
                    Lv.{card.level.current.toLocaleString()}
                  </p>
                </div>
                <div className="w-0 h-0 border-t-[1.25rem] sm:border-t-[1.5rem] border-l-[1.25rem] sm:border-l-[1.5rem] border-t-transparent border-l-slate-50" />
              </div>
              <Image
                src={`https://praditnet-cdn.rayriffy.com/ongeki/card/full/${card.id}.png`}
                width={384}
                height={526}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { getUserDeck } = await import(
    '../../../../modules/ongeki/deck/services/getUserDeck'
  )
  const { getApiUserSession } = await import(
    '../../../../core/services/authentication/api/getApiUserSession'
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

  const userDeck = await getUserDeck(user.aimeCard, Number(ctx.params.deckId))

  if (userDeck === null) {
    return {
      notFound: true,
    }
  } else {
    return {
      props: {
        user: {
          aime: user.aimeCard,
          eamuse: user.eamuseCard,
        },
        deck: userDeck,
      },
    }
  }
}

export default Page
