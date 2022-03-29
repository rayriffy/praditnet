import axios from 'axios'
import { useRouter } from 'next/router'
import { FormEventHandler, Fragment, memo, useRef, useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

import { Image } from '../../../../core/components/image'

interface Props {
  eventId: string
  musics: {
    [key: string]: {
      id: number
      name: string
      artist: string
      level: string
      difficulty: number
    }[]
  }
}

export const Form = memo<Props>(props => {
  const { eventId, musics } = props

  const [progress, setProgress] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const realNameRef = useRef<HTMLInputElement>(null)
  const inGameNameRef = useRef<HTMLInputElement>(null)
  const ratingRef = useRef<HTMLInputElement>(null)
  const [participatedGame, setParticipatedGame] = useState<string | null>(null)

  const router = useRouter()

  const onSubmit: FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault()

    setError(null)
    setProgress(true)

    // validate
    if (/^[\u0E00-\u0E7F\s]+$/.exec(realNameRef.current.value) === null) {
      setError('Please write your name in Thai')
      setProgress(false)
      return
    } else if (/^\d*\.?\d*$/.exec(ratingRef.current.value) === null) {
      setError('Rating is not a valid number')
      setProgress(false)
      return
    } else if (Number(ratingRef.current.value) < 0) {
      setError('Rating must be greater than 0')
      setProgress(false)
      return
    } else if (
      Number(ratingRef.current.value) % 1 !== 0 &&
      participatedGame === 'maimai'
    ) {
      setError('Rating does not have a valid format')
      setProgress(false)
      return
    } else if (
      Number(ratingRef.current.value) >= 18 &&
      participatedGame === 'chunithm'
    ) {
      setError('Rating does not have a valid format')
      setProgress(false)
      return
    }

    // get recapcha token
    let token = null
    try {
      token = await recaptchaRef.current.executeAsync()
    } catch (e) {
      setError('ReCAPTCHA verification failed!')
      setProgress(false)
      return
    }

    // send payload
    try {
      await axios.post(
        '/api/event/register',
        {
          event: eventId,
          realName: realNameRef.current.value,
          inGameName: inGameNameRef.current.value,
          rating: Number(ratingRef.current.value),
          participatedGame,
        },
        {
          headers: {
            'X-PraditNET-Capcha': token,
          },
        }
      )

      router.push(`/event/${eventId}`)
      setProgress(false)
    } catch (e) {
      recaptchaRef.current.reset()
      setError(e.response.data.message)
      setProgress(false)
    }
  }

  return (
    <Fragment>
      <form className="space-y-8 divide-y divide-gray-200" onSubmit={onSubmit}>
        <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
          <div className="space-y-6 sm:space-y-5">
            <div className="space-y-6 sm:space-y-5">
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                <label
                  htmlFor="real-name"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Real name
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input
                    type="text"
                    name="real-name"
                    id="real-name"
                    ref={realNameRef}
                    disabled={progress}
                    required
                    className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  />
                  <p className="text-sm text-gray-500 mt-3">
                    Please write your name in Thai, and without intitials (e.g.
                    นาย ด.ช.)
                  </p>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="in-game-name"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  In-game name
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input
                    type="text"
                    name="in-game-name"
                    id="last-name"
                    maxLength={10}
                    ref={inGameNameRef}
                    disabled={progress}
                    required
                    className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  />
                  <p className="text-sm text-gray-500 mt-3">
                    You can copy in-game name from{' '}
                    <a
                      href="https://maimaidx-eng.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 font-medium"
                    >
                      maimaiNET
                    </a>
                    , or{' '}
                    <a
                      href="https://chunithm-net-eng.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 font-medium"
                    >
                      CHUNITHM-NET
                    </a>
                  </p>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="rating"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Rating
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input
                    type="text"
                    name="rating"
                    id="rating"
                    // inputMode="decimal"
                    ref={ratingRef}
                    disabled={progress}
                    required
                    className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:border-t sm:border-gray-200 sm:pt-5">
                <div role="group" aria-labelledby="label-participated-game">
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-baseline">
                    <div>
                      <div
                        className="text-base font-medium text-gray-900 sm:text-sm sm:text-gray-700"
                        id="label-participated-game"
                      >
                        Participated game
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <div className="max-w-lg">
                        <div className="mt-4 space-y-4">
                          <div className="flex items-start">
                            <input
                              id="la-participated-game"
                              name="participated-game"
                              type="radio"
                              onChange={e => {
                                e.target.checked
                                  ? setParticipatedGame('maimai')
                                  : null
                              }}
                              disabled={progress}
                              required
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                            />
                            <label
                              htmlFor="la-participated-game"
                              className="ml-3 block text-sm font-medium text-gray-700"
                            >
                              <span>maimai DX</span>
                              <div className="mt-1 flex space-x-2">
                                {musics.maimai.map(music => (
                                  <div
                                    className="flex w-24 rounded overflow-hidden"
                                    key={`music-maimai-${music.id}`}
                                  >
                                    <Image
                                      src={`https://praditnet-cdn.rayriffy.com/maimai/jacket/${music.id}.png`}
                                      width={96}
                                      height={96}
                                    />
                                  </div>
                                ))}
                              </div>
                            </label>
                          </div>
                          <div className="flex items-start">
                            <input
                              id="la-participated-game"
                              name="participated-game"
                              type="radio"
                              onChange={e => {
                                e.target.checked
                                  ? setParticipatedGame('chunithm')
                                  : null
                              }}
                              disabled={progress}
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                            />
                            <label
                              htmlFor="push-email"
                              className="ml-3 block text-sm font-medium text-gray-700"
                            >
                              <span>CHUNITHM NEW!!</span>
                              <div className="mt-1 flex space-x-2">
                                {musics.chunithm.map(music => (
                                  <div
                                    className="flex w-24 rounded overflow-hidden"
                                    key={`music-chunithm-${music.id}`}
                                  >
                                    <Image
                                      src={`https://praditnet-cdn.rayriffy.com/chunithm/jacket/${music.id}.png`}
                                      width={96}
                                      height={96}
                                    />
                                  </div>
                                ))}
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-5">
          {error !== null && (
            <p className="bg-red-100 rounded-md mb-6 text-sm px-4 py-3 text-red-800">
              {error}
            </p>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              disabled={progress}
              className="transition bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={progress}
              className="transition ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 disabled:bg-indigo-400 hover:bg-indigo-700 disabled:hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Apply
            </button>
          </div>
        </div>
      </form>
      <ReCAPTCHA
        ref={recaptchaRef}
        size="invisible"
        sitekey={process.env.RECAPCHA_SITE_KEY}
      />
    </Fragment>
  )
})
