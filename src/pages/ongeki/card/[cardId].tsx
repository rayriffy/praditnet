import { useEffect } from 'react'

import { GetServerSideProps, NextPage } from 'next'

import { Image } from '../../../core/components/image'
import { Navbar } from '../../../modules/ongeki/home/components/navbar'

import { UserCard } from '../../../modules/ongeki/card/@types/UserCard'
import { Kaika } from '../../../modules/ongeki/card/components/kaika'

interface Props {
  userCard: UserCard
}

const Page: NextPage<Props> = props => {
  const {
    card,
    metadata: { skill, level, upgrade },
  } = props.userCard

  return (
    <div className="mt-4">
      <Navbar />
      <div className="grid grid-cols-1 sm:grid-cols-3 mt-4 gap-6">
        <div className="col-span-1">
          <div className="w-4/5 sm:w-full mx-auto">
            <Image
              src={`https://cdn.pradit.net/ongeki/card/full/${card.id}.png`}
              width={384}
              height={526}
            />
          </div>
        </div>
        <div className="col-span-1 sm:col-span-2">
          <div className="flex flex-col">
            <h2 className="text-gray-900 font-bold text-2xl">{card.name}</h2>
            {card.nickname.length !== 0 && (
              <div className="border-b-2 my-2 border-dotted" />
            )}
            <h3 className="ml-2">{card.nickname}</h3>
          </div>
          <div className="bg-gray-50 rounded-lg px-2 sm:px-5 py-4 mt-2 flex items-start sm:items-center flex-col sm:flex-row">
            <div className="shrink-0 rounded-md overflow-hidden ml-3 sm:ml-0 mb-3 sm:mb-0">
              <img
                src={`/assets/ongeki/skillType/${skill.category.toLowerCase()}.png`}
                className="w-14 h-auto"
              />
            </div>
            <div className="pl-4">
              <h2 className="font-semibold">{skill.name}</h2>
              <p className="text-gray-700 text-xs mt-1">{skill.description}</p>
            </div>
          </div>
          <div className="flex mt-3">
            <div className="flex bg-gray-50 px-4 py-3 rounded-lg">
              <span className="font-bold">Level</span>
              <span className="ml-2">
                {level.current} / {level.max}
              </span>
            </div>
            <div className="block my-auto ml-3 sm:ml-4 space-x-2 sm:space-x-4">
              <Kaika cardId={card.id} isKaika={upgrade.kaika} />
              {/* <button
                type="button"
                className={"inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"}
              >
                Cho-Kaika
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { getApiUserSession } = await import(
    '../../../core/services/authentication/api/getApiUserSession'
  )
  const { getUserCard } = await import(
    '../../../modules/ongeki/card/services/getUserCard'
  )

  const user = await getApiUserSession(ctx.req)

  if (user === null || user === undefined) {
    return {
      redirect: {
        statusCode: 302,
        destination: '/login',
      },
    }
  }

  // fetch user card
  const userCard = await getUserCard(
    user.aimeCard,
    Number(ctx.params.cardId as string)
  )
  if (userCard === null) {
    return {
      notFound: true,
    }
  } else {
    return {
      props: {
        userCard,
      },
    }
  }
}

export default Page
