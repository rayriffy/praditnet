import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'

import { PencilAltIcon } from '@heroicons/react/solid'

import { Image } from '../../../core/components/image'
import { Navbar } from '../../../modules/ongeki/home/components/navbar'

import { AppProps } from '../../../app/@types/AppProps'
import { Deck } from '../../../modules/ongeki/deck/@types/Deck'

interface Props extends AppProps {
  decks: Deck[]
}

const Page: NextPage<Props> = props => {
  const { decks } = props

  return (
    <div className="mt-4">
      <Navbar />
      <div className="mt-4 space-y-4 sm:space-y-6">
        {decks.map(deck => (
          <Link key={`deck-${deck.id}`} href={`/ongeki/deck/edit/${deck.id}`}>
            <div className="px-4 sm:px-5 py-6 bg-slate-50 rounded-md cursor-pointer">
              <div className="flex justify-between text-gray-900">
                <h1 className="font-bold text-xl sm:text-2xl">
                  Deck {deck.id}
                </h1>
                <PencilAltIcon className="w-6" />
              </div>
              <div className="grid grid-cols-3 gap-0.5 mt-4">
                {deck.cards.map(card => (
                  <div key={`deck-${deck.id}-card-${card.id}`}>
                    <div className="flex mx-1.5 -mb-1.5 h-6">
                      <div className="w-0 h-0 border-t-[1.5rem] border-r-[1.5rem] border-t-transparent border-white" />
                      <div className="w-full bg-white text-xs flex items-center justify-center px-1">
                        <p className="text-sky-500">
                          Lv.{card.level.current.toLocaleString()}
                        </p>
                      </div>
                      <div className="w-0 h-0 border-t-[1.5rem] border-l-[1.5rem] border-t-transparent border-l-white" />
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
          </Link>
        ))}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { getUserDecks } = await import(
    '../../../modules/ongeki/deck/services/getUserDecks'
  )
  const { getApiUserSession } = await import(
    '../../../core/services/authentication/api/getApiUserSession'
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

  const [userDecks] = await Promise.all([getUserDecks(user.card_luid)])

  return {
    props: {
      user: {
        cardId: user.card_luid,
      },
      decks: userDecks,
    },
  }
}

export default Page
