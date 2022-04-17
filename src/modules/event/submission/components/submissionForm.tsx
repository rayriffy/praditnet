import { FormEventHandler, Fragment, memo, useMemo, useState } from 'react'

import axios from 'axios'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

import { Metadata } from './metadata'
import { Image } from '../../../../core/components/image'
import { classNames } from '../../../../core/services/classNames'
import { maimaiMetadata } from '../constants/maimaiMetadata'
import { chunithmMetadata } from '../constants/chunithmMetadata'

import { Submission } from '../@types/Submission'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid'

interface Props {
  eventId: string
  submission: Submission
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

export const SubmissionForm = memo<Props>(props => {
  const { musics, submission, eventId } = props

  const [progress, setProgress] = useState(false)
  const [conclusion, setConclusion] = useState<'default' | 'fail' | 'success'>(
    'default'
  )
  const [error, setError] = useState('')
  const isBlocked = useMemo(
    () => submission.remainingAttempts < 1,
    [submission.remainingAttempts]
  )

  const { executeRecaptcha } = useGoogleReCaptcha()

  const onSubmit: FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault()

    setProgress(true)

    try {
      const targetMusicIds = musics[submission.selectedGameId].map(o => o.id)
      const targetMetadatas = [
        'score',
        'isClear',
        'isFullCombo',
        submission.selectedGameId === 'maimai'
          ? 'isAllPerfect'
          : 'isAllJustice',
      ]

      // build payload
      const scores = await Promise.all(
        targetMusicIds.map(async musicId => {
          // for each metadata
          const { score, ...metadata } = Object.fromEntries(
            await Promise.all(
              targetMetadatas.map(async metadata => {
                const targetElement: HTMLInputElement = document.querySelector(
                  `input#music-${musicId}-${metadata}`
                )
                const targetValue = !metadata.startsWith('is')
                  ? Number(targetElement.value)
                  : targetElement.checked

                return [metadata, targetValue]
              })
            )
          )

          return {
            id: musicId,
            score,
            metadata,
          }
        })
      )

      const token = await executeRecaptcha('event/submitScore')

      await axios.post(
        '/api/event/submitScore',
        {
          eventId,
          submissionId: submission.userId,
          scores,
        },
        {
          headers: {
            'X-PraditNET-Capcha': token,
          },
        }
      )

      setConclusion('success')
    } catch (e) {
      setError(e.reponse.data.message)
      setConclusion('fail')
    } finally {
      setProgress(false)
    }
  }

  return (
    <Fragment>
      {conclusion === 'success' ? (
        <div className="bg-white dark:bg-neutral-700 shadow rounded-lg border px-4 py-5 sm:p-6 flex">
          <CheckCircleIcon className="w-8 h-8 text-green-500 shrink-0" />
          <div className="pl-4">
            <h1 className="text-xl font-bold dark:text-white">
              Score submitted
            </h1>
            <p className="text-gray-700 dark:text-white">
              Player score has been recorded
            </p>
          </div>
        </div>
      ) : conclusion === 'fail' ? (
        <div className="bg-white dark:bg-neutral-700 shadow rounded-lg border px-4 py-5 sm:p-6 flex">
          <XCircleIcon className="w-8 h-8 text-red-500 shrink-0" />
          <div className="pl-4">
            <h1 className="text-xl font-bold dark:text-white">
              There's a problem
            </h1>
            <p className="text-gray-700 dark:text-white">
              Server said: {error}
            </p>
          </div>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="bg-gradient-to-r from-slate-100 to-gray-100 dark:from-neutral-700 dark:to-stone-700 rounded-md px-5 py-4 block sm:flex sm:justify-between">
            <div className="flex justify-between sm:justify-start space-x-0 sm:space-x-4">
              <img
                src={`/assets/logo/${submission.selectedGameId}.png`}
                className="w-40 h-auto"
              />
              <div className="flex items-center">
                <p className="py-1 px-6 font-semibold text-lg bg-gray-700 text-white rounded-md dark:bg-gray-100 dark:text-gray-900">
                  {submission.inGameName}
                </p>
              </div>
            </div>
            <div className="flex items-center flex-row-reverse mt-2 justify-end sm:block">
              <div className="ml-2 sm:ml-0 flex sm:mt-2 justify-start sm:justify-center">
                <p className="bg-gray-700 text-white font-semibold text-lg rounded px-4 py-1 dark:bg-gray-100 dark:text-gray-900">
                  {submission.remainingAttempts}
                </p>
              </div>
              <p className="dark:text-white">Remaining attempts</p>
            </div>
          </div>
          <div className="space-y-6 max-w-2xl mx-auto">
            {musics[submission.selectedGameId].map(music => (
              <div
                className="bg-white dark:bg-neutral-700 shadow rounded-lg border px-4 py-5 sm:p-6 flex flex-col sm:flex-row"
                key={`music-${submission.selectedGameId}-${music.id}`}
              >
                <div className="flex rounded-lg overflow-hidden shrink-0 mx-auto">
                  <Image
                    src={`https://cdn.pradit.net/${submission.selectedGameId}/jacket/${music.id}.png`}
                    width={175}
                    height={175}
                  />
                </div>
                <div className="pl-0 pt-4 sm:pt-0 sm:pl-4 w-full">
                  <h1 className="font-bold text-xl sm:text-2xl dark:text-white">
                    {music.name}
                  </h1>
                  <div className="mt-0 sm:mt-2 w-full sm:w-3/5">
                    <label
                      htmlFor={`music-${music.id}-score`}
                      className="block text-sm font-medium text-gray-700 dark:text-white"
                    >
                      Score
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name={`music-${music.id}-score`}
                        id={`music-${music.id}-score`}
                        disabled={progress || isBlocked}
                        inputMode="decimal"
                        className={classNames(
                          isBlocked
                            ? 'disabled:cursor-not-allowed'
                            : 'disabled:cursor-wait',
                          'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100'
                        )}
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-2">
                    <Metadata
                      musicId={music.id}
                      disabled={progress}
                      blocked={isBlocked}
                      items={
                        submission.selectedGameId === 'maimai'
                          ? maimaiMetadata
                          : chunithmMetadata
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4 pt-2">
            <div className="flex justify-center">
              <div className="flex items-center h-5">
                <input
                  id="confirm-check"
                  aria-describedby="comments-description"
                  name="confirm-check"
                  type="checkbox"
                  disabled={progress || isBlocked}
                  className={classNames(
                    isBlocked
                      ? 'disabled:cursor-not-allowed'
                      : 'disabled:cursor-wait',
                    'focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded disabled:text-indigo-400 disabled:bg-gray-100'
                  )}
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="confirm-check"
                  className="font-medium text-gray-700 dark:text-white"
                >
                  I confirm that I've double-checked before submitting score
                </label>
              </div>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={progress || isBlocked}
                className={classNames(
                  isBlocked
                    ? 'disabled:cursor-not-allowed'
                    : 'disabled:cursor-wait',
                  'transition inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                )}
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      )}
    </Fragment>
  )
})
