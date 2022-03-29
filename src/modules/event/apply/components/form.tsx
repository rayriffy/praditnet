import { Fragment, memo, useRef, useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

import { Image } from '../../../../core/components/image'

interface Props {
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
  const { musics } = props

  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const realNameRef = useRef<HTMLInputElement>(null)
  const inGameNameRef = useRef<HTMLInputElement>(null)
  const ratingRef = useRef<HTMLInputElement>(null)
  const [participatedGame, setParticipatedGame] = useState<string | null>(null)

  return (
    <Fragment>
      <div className="space-y-8 divide-y divide-gray-200">
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
                    className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  />
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
                    ref={inGameNameRef}
                    className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  />
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
                    ref={ratingRef}
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
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="button"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
      <ReCAPTCHA
        ref={recaptchaRef}
        size="invisible"
        sitekey={process.env.RECAPCHA_SITE_KEY}
      />
    </Fragment>
  )
})
