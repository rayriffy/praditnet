import {
  Dispatch,
  FormEventHandler,
  Fragment,
  memo,
  SetStateAction,
  useRef,
  useState,
} from 'react'

import { Dialog, Transition } from '@headlessui/react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import NProgress from 'nprogress'
import { createApiInstance } from '../../../core/services/createApiInstance'

export interface AimeTransferDialogProps {
  show: boolean
  setShow: Dispatch<SetStateAction<boolean>>
  cardId: string | null
}

export const TransferDialog = memo<AimeTransferDialogProps>(props => {
  const { show, setShow, cardId } = props

  const [progress, setProgress] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const { executeRecaptcha } = useGoogleReCaptcha()

  const inputRef = useRef<HTMLInputElement>(null)
  const onSubmit: FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault()

    setProgress(true)
    setError(null)

    try {
      const axios = await createApiInstance(executeRecaptcha('system/card'))
      const inputCardId = inputRef.current.value
      await axios.post('card/set', {
        cardId: inputCardId.toLowerCase(),
      })

      NProgress.configure({ minimum: 0.3 })
      NProgress.start()

      window.location.reload()
    } catch (e) {
      setError(e.response.data.message)
      setProgress(false)
    }
  }

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={setShow}
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
              className="inline-block align-bottom bg-white dark:bg-neutral-800 rounded-lg px-4 py-6 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6"
            >
              <div>
                <div className="text-left">
                  <Dialog.Title
                    as="h3"
                    className="text-xl leading-6 font-medium text-gray-900 dark:text-white"
                  >
                    {cardId !== null ? 'Transfer' : 'Bind'} card
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-100">
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
                      ref={inputRef}
                      name="accessCode"
                      inputMode="numeric"
                      pattern="^[\dabcdefABCDEF]{20}$"
                      required
                      id="accessCode"
                      maxLength={20}
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
                  onClick={() => setShow(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
})
