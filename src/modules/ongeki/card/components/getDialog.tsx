import {
  Dispatch,
  Fragment,
  memo,
  MutableRefObject,
  SetStateAction,
  useState,
} from 'react'

import { Dialog, Transition } from '@headlessui/react'
import ReCAPTCHA from 'react-google-recaptcha'
import axios from 'axios'

export interface GetDialogProps {
  id: number
  name: string

  show: boolean
  setShow: Dispatch<SetStateAction<boolean>>

  recaptchaRef: MutableRefObject<ReCAPTCHA>
}

export const GetDialog = memo<GetDialogProps>(props => {
  const { show, setShow, id, name, recaptchaRef } = props

  const [progress, setProgress] = useState(false)
  const [error, setError] = useState<string>(null)

  const onSubmit = async () => {
    recaptchaRef.current.reset()

    setError(null)
    setProgress(true)

    let token = null
    try {
      token = await recaptchaRef.current.executeAsync()
    } catch (e) {
      setError('ReCAPTCHA verification failed!')
      setProgress(false)
      return
    }

    if (token !== null) {
      try {
        const body = {
          id: id,
        }

        const res = await axios.post('/api/ongeki/card/get', body, {
          headers: {
            'X-PraditNET-Capcha': token,
          },
        })

        if (res.status === 200) {
          console.log('Successfully got card!')
          window.location.reload()
        } else {
          throw new Error(await res.data())
        }
      } catch (error) {
        console.error('An unexpected error happened occurred:', error)
        recaptchaRef.current.reset()
        setError(error.response.data)
        setProgress(false)
      }
    } else {
      setError('ReCAPTCHA verification failed!')
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
            <div className="inline-block align-bottom bg-white dark:bg-neutral-800 rounded-lg px-4 py-6 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6">
              <div>
                <div className="text-left">
                  <Dialog.Title
                    as="h3"
                    className="text-xl leading-6 font-medium text-gray-900 dark:text-white"
                  >
                    Get this card
                  </Dialog.Title>
                  <div className="mt-2">
                    {error !== null && (
                      <p className="bg-red-100 rounded-md mt-2 text-sm px-4 py-3 text-red-800">
                        {error}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-100">
                      Card <b>{name}</b> will be added into your acconut
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 space-y-4">
                <button
                  type="submit"
                  disabled={progress}
                  onClick={() => onSubmit()}
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm disabled:bg-indigo-400 disabled:hover:bg-indigo-500 disabled:cursor-wait transition"
                >
                  Yes, I want it!
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
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
})
