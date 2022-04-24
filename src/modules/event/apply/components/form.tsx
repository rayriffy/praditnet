import { FormEventHandler, memo, useRef, useState } from 'react'

import { useRouter } from 'next/router'

import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

import { Image } from '../../../../core/components/image'
import { classNames } from '../../../../core/services/classNames'
import { createApiInstance } from '../../../../core/services/createApiInstance'

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
  const [failedAt, setFailedAt] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const realNameRef = useRef<HTMLInputElement>(null)
  const inGameNameRef = useRef<HTMLInputElement>(null)
  const facebookRef = useRef<HTMLInputElement>(null)
  const shirtSizeRef = useRef<HTMLSelectElement>(null)
  const [participatedGame, setParticipatedGame] = useState<string | null>(null)

  const router = useRouter()
  const { executeRecaptcha } = useGoogleReCaptcha()

  const onSubmit: FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault()

    setError(null)
    setFailedAt(null)
    setProgress(true)

    // validate
    if (/^[\u0E00-\u0E7F\s]+$/.exec(realNameRef.current.value) === null) {
      setError('Please write your name in Thai')
      setFailedAt('realName')
      setProgress(false)
      return
    } else if (
      /http(s?)(:\/\/)((www.)?)(([^.]+)\.)?facebook.com(\/[^\s]*)?/.exec(
        facebookRef.current.value
      ) === null
    ) {
      setError('Facebook URL has invalid format')
      setFailedAt('facebook')
      setProgress(false)
      return
    }

    // get recapcha token
    let axios = await createApiInstance(executeRecaptcha('event/apply'))

    // send payload
    try {
      await axios.post('event/register', {
        event: eventId,
        realName: realNameRef.current.value,
        inGameName: inGameNameRef.current.value,
        facebook: facebookRef.current.value,
        shirtSize: shirtSizeRef.current.value,
        participatedGame,
      })

      router.push(`/event/${eventId}`)
      setProgress(false)
    } catch (e) {
      setError(e.response.data.message)
      setProgress(false)
    }
  }

  return (
    <form className="space-y-8 divide-y divide-gray-200" onSubmit={onSubmit}>
      <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <div className="space-y-6 sm:space-y-5">
          <div className="space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
              <label
                htmlFor="real-name"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-white"
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
                  className={classNames(
                    failedAt === 'realName' ? 'border-2 border-red-500' : '',
                    'max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md'
                  )}
                />
                <p className="text-sm text-gray-500 mt-3 dark:text-gray-200">
                  Please write your name in Thai, and without intitials (e.g.
                  นาย ด.ช.)
                </p>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="in-game-name"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-white"
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
                <p className="text-sm text-gray-500 mt-3 dark:text-gray-200">
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
                <p className="text-sm text-red-500 mt-0">
                  Please do not change in-game name until qualification is
                  finished
                </p>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="facebook"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-white"
              >
                Link to Facebook
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  name="facebook"
                  id="facebook"
                  ref={facebookRef}
                  disabled={progress}
                  required
                  placeholder="https://facebook.com/rayriffy"
                  className={classNames(
                    failedAt === 'facebook' ? 'border-2 border-red-500' : '',
                    'max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md'
                  )}
                />
                <p className="text-sm text-gray-500 mt-3 dark:text-gray-200">
                  We will contact you in case you has been qualified for the
                  main event day
                </p>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="shirtSize"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 dark:text-white"
              >
                Shirt size
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <select
                  id="shirtSize"
                  name="shirtSize"
                  className="max-w-lg sm:max-w-xs block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  defaultValue="M"
                  ref={shirtSizeRef}
                  required
                >
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="2XL">2XL</option>
                  <option value="3XL">3XL</option>
                </select>
                <p className="text-sm text-gray-500 mt-3 dark:text-gray-200">
                  If you're qualified, you will get a shirt for finalists as
                  well.
                </p>
              </div>
            </div>

            <div className="sm:border-t sm:border-gray-200 sm:pt-5">
              <div role="group" aria-labelledby="label-participated-game">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-baseline">
                  <div>
                    <div
                      className="text-base font-medium sm:text-sm text-gray-700 dark:text-white"
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
                            className="ml-3 block text-sm font-medium text-gray-700 dark:text-white"
                          >
                            <span>maimai DX</span>
                            <div className="mt-1 flex space-x-2">
                              {musics.maimai.map(music => (
                                <div
                                  className="flex w-24 rounded overflow-hidden"
                                  key={`music-maimai-${music.id}`}
                                >
                                  <Image
                                    src={`https://cdn.pradit.net/maimai/jacket/${music.id}.png`}
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
                            className="ml-3 block text-sm font-medium text-gray-700 dark:text-white"
                          >
                            <span>CHUNITHM NEW!!</span>
                            <div className="mt-1 flex space-x-2">
                              {musics.chunithm.map(music => (
                                <div
                                  className="flex w-24 rounded overflow-hidden"
                                  key={`music-chunithm-${music.id}`}
                                >
                                  <Image
                                    src={`https://cdn.pradit.net/chunithm/jacket/${music.id}.png`}
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
  )
})
function executeRecaptcha(arg0: string) {
  throw new Error('Function not implemented.')
}
