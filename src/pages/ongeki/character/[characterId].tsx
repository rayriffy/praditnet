import { Fragment } from 'react'

import { GetServerSideProps, NextPage } from 'next'

import { Image } from '../../../core/components/image'
import { Navbar } from '../../../modules/ongeki/home/components/navbar'

import { AppProps } from '../../../app/@types/AppProps'
import { UserCharacter } from '../../../modules/ongeki/character/services/getUserCharacters'
import { classNames } from '../../../core/services/classNames'
import Link from 'next/link'

interface Props extends AppProps {
  // characters: UserCharacter[
  character: any
}

const Page: NextPage<Props> = props => {
  const { character } = props

  return (
    <Fragment>
      <div className="mt-4">
        <Navbar />
        <div
          className="max-w-xl mx-auto my-4 relative h-[28rem] rounded-lg"
          style={{
            background: 'url(/assets/ongeki/characterBackground.png)',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute h-[24rem] bottom-0 left-0 right-0 overflow-hidden flex justify-center sm:justify-start">
            <div className="-mt-14 shrink-0">
              <Image
                className=""
                src={`https://praditnet-cdn.rayriffy.com/ongeki/card/deka/${character.cardId}.png`}
                // layout='responsive'
                width={768 / 2.3}
                height={1052 / 2.3}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { getApiUserSession } = await import(
    '../../../core/services/authentication/api/getApiUserSession'
  )
  const { getUserCharacter } = await import(
    '../../../modules/ongeki/character/services/getUserCharacter'
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

  try {
    const character = await getUserCharacter(
      user.card_luid,
      Number(ctx.params.characterId)
    )

    return {
      props: {
        user: {
          cardId: user.card_luid,
        },
        character,
      },
    }
  } catch (e) {
    return {
      notFound: true,
    }
  }
}

export default Page
