import { Fragment } from 'react'

import { GetServerSideProps, NextPage } from 'next'

import { Image } from '../../../core/components/image'
import { Navbar } from '../../../modules/ongeki/home/components/navbar'

import { AppProps } from '../../../app/@types/AppProps'
import { UserCharacter } from '../../../modules/ongeki/character/services/getUserCharacters'
import { classNames } from '../../../core/services/classNames'
import Link from 'next/link'

interface Props extends AppProps {
  characters: UserCharacter[]
}

const Page: NextPage<Props> = props => {
  const { characters } = props

  return (
    <Fragment>
      <div className="mt-4">
        <Navbar />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
          {characters.map(character => (
            <Link
              key={`character-${character.id}`}
              href={`/ongeki/character/${character.id}`}
            >
              <a className="relative">
                <div className="absolute bottom-8 left-2">
                  <div className="relative">
                    <img src="/assets/ongeki/gage.png" className="w-16" />
                    <p className="text-shadow-pink text-white font-bold absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center">
                      {Math.floor(character.relationshipLevel / 1000) !== 0 && (
                        <span className="-mt-2.5 text-sm -ml-0.5 mr-0.5">
                          {Math.floor(character.relationshipLevel / 1000)}
                        </span>
                      )}
                      <span>{character.relationshipLevel % 1000}</span>
                    </p>
                  </div>
                </div>
                <img
                  src={`/assets/ongeki/characterBanner/${character.id}.png`}
                  className="w-full h-auto"
                />
              </a>
            </Link>
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
  const { getUserCharacters } = await import(
    '../../../modules/ongeki/character/services/getUserCharacters'
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

  const characters = await getUserCharacters(user.card_luid)

  return {
    props: {
      user: {
        cardId: user.card_luid,
      },
      characters,
    },
  }
}

export default Page
