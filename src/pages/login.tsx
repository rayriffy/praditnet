import { FormEventHandler, useRef, useState } from 'react'

import { NextPage } from 'next'
import { useRouter } from 'next/router'

import axios from 'axios'
import ReCAPTCHA from 'react-google-recaptcha'

const Page: NextPage = props => {
  const [progress, setProgress] = useState<boolean>(false)
  const [error, setError] = useState<string>(null)

  const [recapchaKey, setRecapchaKey] = useState<string | undefined>(undefined)

  const recaptchaRef = useRef(null)
  const router = useRouter()

  const onSubmit: FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault()

    setProgress(true)
    setError(null)

    const body = {
      username: event.currentTarget.username.value,
      password: event.currentTarget.password.value,
    }

    try {
      const res = await axios.post('/api/authentication/login', body, {
        headers: {
          'X-PraditNET-Capcha': recapchaKey,
        },
      })
      if (res.status === 200) {
        router.push('/')
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
    <div className="mx-auto max-w-md py-6">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
        Login
      </h1>

      {error !== null && (
        <p className="bg-red-100 rounded-md mt-4 -mb-2 text-sm px-4 py-3 text-red-800">
          {error}
        </p>
      )}

      <form className="mt-8 space-y-6" onSubmit={onSubmit}>
        <ReCAPTCHA
          ref={recaptchaRef}
          size="invisible"
          sitekey={process.env.RECAPCHA_SITE_KEY}
          onChange={value => setRecapchaKey(value)}
        />
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition disabled:bg-gray-100 disabled:cursor-wait"
              placeholder="Username"
              disabled={progress}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition disabled:bg-gray-100 disabled:cursor-wait"
              placeholder="Password"
              disabled={progress}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-900"
            >
              Remember me
            </label> */}
          </div>

          <div className="text-sm dark:text-white">
            Not having an account?{' '}
            <a
              href="/register"
              className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
            >
              Create one
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={progress}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:bg-indigo-400 disabled:hover:bg-indigo-500 disabled:cursor-wait dark:bg-indigo-100 dark:text-indigo-700"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  )
}

export default Page
