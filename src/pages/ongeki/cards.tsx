import { Fragment, useRef, useState } from 'react'

import { GetServerSideProps, NextPage } from 'next'

import { Navbar } from '../../modules/ongeki/home/components/navbar'

import { AppProps } from '../../app/@types/AppProps'
import { RarityOverview } from '../../modules/ongeki/card/services/getOverviewCard'

import { useCardSearch } from '../../modules/ongeki/card/services/useCardSearch'
import {
  ChevronDownIcon,
  ChevronRightIcon,
  SearchCircleIcon,
} from '@heroicons/react/solid'
import { Card } from '../../modules/ongeki/card/components/card'
import { CardPagination } from '../../modules/ongeki/card/components/cardPagination'
import { paginationItems } from '../../core/constants/paginationItems'
import { CardSkeleton } from '../../modules/ongeki/card/components/cardSkeleton'
import { classNames } from '../../core/services/classNames'

interface Props extends AppProps {
  userId: string
  overview: RarityOverview
}

const Page: NextPage<Props> = props => {
  const { overview, userId } = props

  const [rarityToggle, setRarityToggle] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const rarityNCheckboxRef = useRef<HTMLInputElement>(null)
  const rarityRCheckboxRef = useRef<HTMLInputElement>(null)
  const raritySRCheckboxRef = useRef<HTMLInputElement>(null)
  const raritySRPCheckboxRef = useRef<HTMLInputElement>(null)
  const raritySSRCheckboxRef = useRef<HTMLInputElement>(null)

  const { loading, cards, pagination, refetch, onPaginate } = useCardSearch(
    userId,
    {
      text: inputRef.current?.value ?? '',
      rarity: {
        n: rarityNCheckboxRef.current?.checked ?? true,
        r: rarityRCheckboxRef.current?.checked ?? true,
        sr: raritySRCheckboxRef.current?.checked ?? true,
        srp: raritySRPCheckboxRef.current?.checked ?? true,
        ssr: raritySSRCheckboxRef.current?.checked ?? true,
      },
    }
  )

  return (
    <Fragment>
      <div className="mt-4">
        <Navbar />
        <div className="flex flex-wrap justify-center">
          {['n', 'r', 'sr', 'srp', 'ssr'].map(rarity => (
            <div
              key={`overview-${rarity}`}
              className="m-2 w-20 rounded-full bg-white dark:bg-neutral-800 border-2 border-pink-500 aspect-square flex flex-col items-center justify-center shrink-0"
            >
              <img
                src={`/assets/ongeki/cardRarity/${rarity}.png`}
                className="h-7 w-auto m-1"
              />
              <p className="font-medium text-gray-700 dark:text-gray-50 text-xs">
                {overview[rarity].owned} / {overview[rarity].total}
              </p>
            </div>
          ))}
        </div>
        <div className="max-w-sm mx-auto my-4">
          <div className="relative rounded-md shadow-sm">
            <input
              type="text"
              name="account-number"
              id="account-number"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Type to search..."
              ref={inputRef}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <SearchCircleIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
          </div>
          <button
            className="w-full bg-gray-100 mt-2 text-xs rounded leading-none px-2 py-1 text-center relative dark:bg-neutral-600 dark:text-white"
            onClick={() => setRarityToggle(o => !o)}
          >
            <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
              {rarityToggle ? (
                <ChevronDownIcon
                  className="h-4 w-4 text-gray-400 dark:text-white"
                  aria-hidden="true"
                />
              ) : (
                <ChevronRightIcon
                  className="h-4 w-4 text-gray-400 dark:text-white"
                  aria-hidden="true"
                />
              )}
            </div>
            <span>Filter</span>
          </button>
          <div
            className={classNames(
              rarityToggle ? 'block' : 'hidden',
              'mt-2 flex justify-center space-x-2'
            )}
          >
            <div className="flex items-center">
              <input
                id="check-rarity-n"
                type="checkbox"
                defaultChecked
                className="focus:ring-indigo-500 h-3.5 w-3.5 text-indigo-600 border-gray-300 rounded"
                ref={rarityNCheckboxRef}
              />
              <label htmlFor="check-rarity-n" className="ml-1">
                <img
                  src={`/assets/ongeki/cardRarity/n.png`}
                  className="h-6 w-auto"
                />
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="check-rarity-r"
                type="checkbox"
                defaultChecked
                className="focus:ring-indigo-500 h-3.5 w-3.5 text-indigo-600 border-gray-300 rounded"
                ref={rarityRCheckboxRef}
              />
              <label htmlFor="check-rarity-r" className="ml-1">
                <img
                  src={`/assets/ongeki/cardRarity/r.png`}
                  className="h-6 w-auto"
                />
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="check-rarity-sr"
                type="checkbox"
                defaultChecked
                className="focus:ring-indigo-500 h-3.5 w-3.5 text-indigo-600 border-gray-300 rounded"
                ref={raritySRCheckboxRef}
              />
              <label htmlFor="check-rarity-sr" className="ml-1">
                <img
                  src={`/assets/ongeki/cardRarity/sr.png`}
                  className="h-6 w-auto"
                />
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="check-rarity-srp"
                type="checkbox"
                defaultChecked
                className="focus:ring-indigo-500 h-3.5 w-3.5 text-indigo-600 border-gray-300 rounded"
                ref={raritySRPCheckboxRef}
              />
              <label htmlFor="check-rarity-srp" className="ml-1">
                <img
                  src={`/assets/ongeki/cardRarity/srp.png`}
                  className="h-6 w-auto"
                />
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="check-rarity-ssr"
                type="checkbox"
                defaultChecked
                className="focus:ring-indigo-500 h-3.5 w-3.5 text-indigo-600 border-gray-300 rounded"
                ref={raritySSRCheckboxRef}
              />
              <label htmlFor="check-rarity-ssr" className="ml-1">
                <img
                  src={`/assets/ongeki/cardRarity/ssr.png`}
                  className="h-6 w-auto"
                />
              </label>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: paginationItems }).map((_, i) => (
                <CardSkeleton key={`card-skeleton-${i}`} />
              ))
            : cards.map(card => (
                <Card key={`card-${card.id}`} card={card} refetch={refetch} />
              ))}
        </div>
        {/* {loading ? (
          <div className="flex justify-center mt-4">
            <Spinner className="animate-spin h-6 w-6 text-gray-900" />
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {cards.map(card => (
              <Card key={`card-${card.id}`} card={card} refetch={refetch} />
            ))}
          </div>
        )} */}
        <CardPagination pagination={pagination} onPaginate={onPaginate} />
      </div>
    </Fragment>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { getApiUserSession } = await import(
    '../../core/services/authentication/api/getApiUserSession'
  )
  const { getOverviewCard } = await import(
    '../../modules/ongeki/card/services/getOverviewCard'
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

  const [overview] = await Promise.all([getOverviewCard(user.aimeCard)])

  return {
    props: {
      user: {
        aime: user.aimeCard,
        eamuse: user.eamuseCard,
      },
      userId: user.uid,
      overview,
    },
  }
}

export default Page
