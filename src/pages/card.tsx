import { FormEventHandler, Fragment, useState } from 'react'

import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'

import { Dialog, Transition } from '@headlessui/react'

import { BiTransfer } from 'react-icons/bi'
import { LogoutIcon, PlusIcon } from '@heroicons/react/solid'

import { AppProps } from '../app/@types/AppProps'
import axios from 'axios'

interface Props {
  userData: {
    cardId: string
    chunkedCardId: string[]
  }
  card: {
    luid: string | null
    createdAt: string | null
  }
}

const Page: NextPage<Props> = props => {
  const { cardId, chunkedCardId } = props.userData
  const { createdAt } = props.card

  const [progress, setProgress] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const [open, setOpen] = useState(false)
  const onSubmit: FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault()

    setProgress(true)
    setError(null)

    try {
      const inputCardId = event.currentTarget.accessCode.value
      await axios.post('/api/card/set', {
        cardId: inputCardId,
      })

      window.location.reload()
    } catch (e) {
      setError(e.response.data.message)
      setProgress(false)
    }
  }

  return (
    <div>
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-full aspect-[3.37/2.125] bg-gradient-to-tr from-blue-50 to-gray-50 rounded-xl transition duration-300 hover:shadow-2xl hover:shadow-blue-50 relative hover:scale-105">
          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
            <p className="font-mono text-gray-700 text-lg sm:text-xl">
              {chunkedCardId.join(' ')}
            </p>
            <p className="font-mono text-gray-700 text-sm">
              Created at: {createdAt ?? '--/--'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="inline-flex w-full justify-center relative items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <span className="absolute left-4 flex items-center top-0 bottom-0">
            {cardId !== null ? <BiTransfer /> : <PlusIcon className="w-4" />}
          </span>
          {cardId !== null ? 'Transfer card' : 'Bind card'}
        </button>
        <Link href="/api/authentication/logout">
          <a className="inline-flex w-full justify-center relative items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            <span className="absolute left-4 flex items-center top-0 bottom-0">
              <LogoutIcon className="w-4" />
            </span>
            Logout
          </a>
        </Link>
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={setOpen}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <form
                onSubmit={onSubmit}
                className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6"
              >
                <div>
                  <div className="mt-3 text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-xl leading-6 font-medium text-gray-900"
                    >
                      {cardId !== null ? 'Transfer' : 'Bind'} card
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Please refer access code directly from nearby game
                        cabinets that connected to Pradit Amusement.{' '}
                        <b>
                          Amusement IC access code in game are different when
                          compared to number behind card
                        </b>
                      </p>
                      {error !== null && (
                        <p className="bg-red-100 rounded-md mt-2 text-sm px-4 py-3 text-red-800">
                          {error}
                        </p>
                      )}
                    </div>
                    <div className="my-4">
                      <input
                        type="text"
                        name="accessCode"
                        id="accessCode"
                        disabled={progress}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50 disabled:cursor-wait transition"
                        placeholder="Access code"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 space-y-4">
                  <button
                    type="submit"
                    disabled={progress}
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm disabled:bg-indigo-400 disabled:hover:bg-indigo-500 disabled:cursor-wait transition "
                  >
                    {cardId !== null ? 'Transfer' : 'Bind'}
                  </button>
                  <button
                    type="button"
                    disabled={progress}
                    className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white hover:bg-gray-50 text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-wait transition  "
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { default: chunk } = await import('lodash/chunk')
  const { getApiUserSession } = await import(
    '../core/services/authentication/api/getApiUserSession'
  )
  const { getCardData } = await import('../modules/card/services/getCardData')

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

  const cardData = await getCardData(user.card_luid)

  return {
    props: {
      userData: {
        cardId: user.card_luid,
        chunkedCardId:
          user.card_luid === null
            ? Array.from({ length: 5 }).map(() => `----`)
            : chunk(user.card_luid, 4).map(chunk => chunk.join('')),
      },
      card: cardData,
    },
  }
}

export default Page
