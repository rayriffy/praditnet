import { Fragment, useRef, useState } from 'react'

import { GetServerSideProps, NextPage } from 'next'

import NProgress from 'nprogress'

import { Image } from '../../../core/components/image'
import { Navbar } from '../../../modules/ongeki/home/components/navbar'

import { personalities } from '../../../modules/ongeki/character/constants/personalities'
import { classNames } from '../../../core/services/classNames'

import { AppProps } from '../../../app/@types/AppProps'
import { DetailedCharacter } from '../../../modules/ongeki/character/services/getUserCharacter'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { createApiInstance } from '../../../core/services/createApiInstance'

interface Props extends AppProps {
  character: DetailedCharacter
  isNavigatorEquipped: boolean
}

const Page: NextPage<Props> = props => {
  const { character, isNavigatorEquipped } = props

  const { executeRecaptcha } = useGoogleReCaptcha()

  const [error, setError] = useState<string>(null)
  const [progress, setProgress] = useState<boolean>(false)
  const onNavigatorSet = async () => {
    setError(null)
    setProgress(true)

    const axios = await createApiInstance(executeRecaptcha('ongeki/navigator'))

    try {
      const body = {
        id: character.id,
      }

      const res = await axios.post('ongeki/navigator/set', body)

      if (res.status === 200) {
        NProgress.configure({ minimum: 0.3 })
        NProgress.start()
        window.location.reload()
      } else {
        throw new Error(await res.data())
      }
    } catch (error) {
      console.error('An unexpected error happened occurred:', error)
      setError(error.response.data)
      setProgress(false)
    }
  }

  return (
    <Fragment>
      <div className="mt-4">
        <Navbar />
        <div
          className="max-w-xl mx-auto my-6 relative h-[28rem] rounded-lg -rotate-1 overflow-hidden"
          style={{
            background: 'url(/assets/ongeki/characterBackground.png)',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute h-[28rem] bottom-0 left-0 right-0 flex justify-center rotate-1">
            <div className="shrink-0">
              <Image
                className=""
                src={`https://cdn.pradit.net/ongeki/card/deka/${character.cardId}.png`}
                // layout='responsive'
                width={768 / 2.3}
                height={1052 / 2.3}
              />
            </div>
          </div>
        </div>
        <div className="max-w-sm mx-auto mt-8">
          <div className="flex items-center my-6">
            <p className="text-shadow-pink-lg text-white text-3xl font-bold shrink-0">
              {character.relationshipLevel.toLocaleString()}
            </p>
            <div className="px-5 w-full">
              <h1 className="text-2xl font-semibold text-center">
                {character.name}
              </h1>
              <div className="border-b-[3px] border-pink-400 my-1 rounded"></div>
              <p className="text-pink-500 font-medium text-center">
                CV: {character.voice}
              </p>
            </div>
          </div>
          <p className="-mt-4 text-xs text-right text-gray-900">
            Birthday:{' '}
            <span className="font-semibold">{character.birthday}</span> / Blood
            type: <span className="font-semibold">{character.bloodType}</span> /
            Height: <span className="font-semibold">{character.height}</span>cm
          </p>
          <div className="my-6">
            <button
              className={classNames(
                isNavigatorEquipped
                  ? 'cursor-not-allowed'
                  : progress
                  ? 'cursor-wait'
                  : '',
                'transition text-center navi-button px-5 inline-flex justify-center items-center w-full h-10 border shadow-md rounded text-sm'
              )}
              onClick={() => onNavigatorSet()}
              disabled={isNavigatorEquipped || progress}
            >
              <img src="/assets/ongeki/equipped.png" className="w-8 h-auto" />
              <span className="ml-2">
                {isNavigatorEquipped
                  ? 'Already been set as navigator voice'
                  : 'Set as navigatior voice'}
              </span>
            </button>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg mt-4 sm:-mx-6">
            <h2 className="text-lg text-gray-700 font-bold text-center">
              Personality
            </h2>
            <div className="p-4 bg-white rounded-lg mt-2.5">
              <table className="text-xs table-auto">
                {personalities.map((personality, i) => (
                  <tr key={`personality-${personality.id}`}>
                    <td
                      className={classNames(
                        i !== 0 ? 'mt-2' : '',
                        'whitespace-nowrap bg-pink-400 text-white flex p-0.5 rounded-sm'
                      )}
                    >
                      {personality.name}
                    </td>
                    <td className={classNames(i !== 0 ? 'pt-2' : '', 'pl-2')}>
                      {character.relationshipLevel >= personality.level ? (
                        <Fragment>
                          {character[`personalityParam${i + 1}`]}
                        </Fragment>
                      ) : (
                        <Fragment>
                          親密度Lv.{personality.level}で解放！
                        </Fragment>
                      )}
                    </td>
                  </tr>
                ))}
              </table>
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
  const { getEquippedCharacter } = await import(
    '../../../modules/ongeki/character/services/getEquippedCharacter'
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
    const [character, equipped] = await Promise.all([
      getUserCharacter(user.aimeCard, Number(ctx.params.characterId)),
      getEquippedCharacter(user.aimeCard),
    ])

    return {
      props: {
        user: {
          aime: user.aimeCard,
          eamuse: user.eamuseCard,
        },
        character,
        isNavigatorEquipped: equipped.equipped.character === character.id,
      },
    }
  } catch (e) {
    return {
      notFound: true,
    }
  }
}

export default Page
