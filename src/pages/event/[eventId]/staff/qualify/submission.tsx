import { Fragment, useRef, useState } from 'react'

import { GetServerSideProps, NextPage } from 'next'
import { XCircleIcon } from '@heroicons/react/solid'

import { Spinner } from '../../../../../core/components/spinner'
import axios from 'axios'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { getEventMusics } from '../../../../../modules/event/home/services/getEventMusics'
import { Submission } from '../../../../../modules/event/submission/@types/Submission'
import { SubmissionForm } from '../../../../../modules/event/submission/components/submissionForm'

interface Props {
  event: {
    id: string
  }
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

const Page: NextPage<Props> = props => {
  const { event, musics } = props

  const [progress, setProgress] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const [submission, setSubmission] = useState<Submission | null>(undefined)

  const { executeRecaptcha } = useGoogleReCaptcha()

  const onRequestSubmission = async () => {
    setProgress(true)
    setSubmission(undefined)

    try {
      const token = await executeRecaptcha('event/getSubmission')
      const { data } = await axios.post(
        '/api/event/getSubmission',
        {
          eventId: event.id,
          submissionId: inputRef.current?.value,
        },
        {
          headers: {
            'X-PraditNET-Capcha': token,
          },
        }
      )

      setSubmission(data.notFound === true ? null : data)
    } catch (e) {
      setSubmission(null)
    } finally {
      setProgress(false)
    }
  }

  return (
    <Fragment>
      <div className="flex -mt-6">
        <p className="uppercase bg-red-500 text-white px-2 py-0.5 text-xs rounded">
          Staff mode
        </p>
      </div>
      <div className="mt-6 space-y-4">
        <h1 className="text-2xl font-bold">Qualification submission</h1>

        <div className="bg-white shadow rounded-lg border">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Identify
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Please type in identification ID of target user</p>
            </div>
            <div className="mt-5 sm:flex sm:items-center">
              <div className="w-full sm:max-w-xs">
                <label htmlFor="user-uid" className="sr-only">
                  User ID
                </label>
                <input
                  type="text"
                  name="user-uid"
                  id="user-uid"
                  maxLength={21}
                  ref={inputRef}
                  disabled={progress}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md font-mono disabled:bg-gray-100 disabled:cursor-wait"
                  placeholder="zkER7fjeqx6hC5Q238nHi"
                />
              </div>
              <button
                disabled={progress}
                onClick={() => onRequestSubmission()}
                className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 disabled:bg-indigo-400 hover:bg-indigo-700 disabled:hover:bg-indigo-500 disabled:cursor-wait focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Submit
              </button>
            </div>
          </div>
        </div>

        {progress ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : (
          <Fragment>
            {submission === undefined ? (
              <Fragment />
            ) : submission === null ? (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <XCircleIcon
                      className="h-5 w-5 text-red-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      There was a problem with the ID that you requested
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      Submission ID you're looking for was not found
                      <ul role="list" className="list-disc pl-5 space-y-1 mt-1">
                        <li>
                          Please double-check the spellig of target submission
                          ID again that is was correct
                        </li>
                        <li>
                          You're looking for submission ID for another event
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <SubmissionForm
                eventId={event.id}
                submission={submission}
                musics={musics}
              />
            )}
          </Fragment>
        )}
      </div>
    </Fragment>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { createKnexInstance } = await import(
    '../../../../../core/services/createKnexInstance'
  )
  const { getApiUserSession } = await import(
    '../../../../../core/services/authentication/api/getApiUserSession'
  )
  const { getIsEventStaff } = await import(
    '../../../../../modules/event/home/services/getIsEventStaff'
  )

  const eventId = ctx.params.eventId as string

  // check if auth
  const user = await getApiUserSession(ctx.req)
  if (user === null || user === undefined) {
    return {
      redirect: {
        statusCode: 302,
        destination: '/login',
      },
    }
  }

  const knex = createKnexInstance('praditnet')

  // if no event then 404
  const targetEvent = await knex('Event')
    .where({
      uid: eventId,
    })
    .first()
  if (targetEvent === undefined) {
    await knex.destroy()
    return {
      notFound: true,
    }
  }

  // check is staff, if not then redirect ro event
  const isStaff = await getIsEventStaff(eventId, knex, user.uid)
  if (!isStaff) {
    await knex.destroy()
    return {
      redirect: {
        statusCode: 302,
        destination: `/event/${eventId}`,
      },
    }
  }

  const fetchedMusics = await getEventMusics(
    eventId,
    knex,
    targetEvent.availableGames.split(',')
  )

  await knex.destroy()
  // permit to page
  return {
    props: {
      event: {
        id: targetEvent.uid,
      },
      musics: Object.fromEntries(fetchedMusics),
    },
  }
}

export default Page
