import { FormEventHandler, useState } from 'react'

import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

import { useTitle } from '../core/services/useTitle'
import { createApiInstance } from '../core/services/createApiInstance'

const Page: NextPage = props => {
  const [progress, setProgress] = useState<boolean>(false)
  const [error, setError] = useState<string>(null)

  const router = useRouter()
  const { executeRecaptcha } = useGoogleReCaptcha()

  useTitle('Register')

  const onSubmit: FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault()

    setProgress(true)
    setError(null)

    const payload = {
      username: event.currentTarget.username.value,
      password: event.currentTarget.password.value,
    }

    if (payload.password !== event.currentTarget.rpassword.value) {
      setProgress(false)
      setError(`The passwords doesn't match`)
      return
    }

    try {
      const axios = await createApiInstance(executeRecaptcha('system/register'))
      const res = await axios.post('authentication/register', payload)

      if (res.status === 200) {
        router.push('/')
      } else {
        throw new Error(res.data())
      }
    } catch (error) {
      console.error('An unexpected error happened occurred:', error)
      setError(error.response.data)
      setProgress(false)
    }
  }

  return (
    <div className="mx-auto max-w-md py-6">
      <h1 className="text-4xl font-bold text-gray-900">Register</h1>

      {error !== null && (
        <p className="bg-red-100 rounded-md mt-4 -mb-2 text-sm px-4 py-3 text-red-800">
          {error}
        </p>
      )}

      <form className="mt-8 space-y-6" onSubmit={onSubmit}>
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
              autoComplete="new-password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition disabled:bg-gray-100 disabled:cursor-wait"
              placeholder="Password"
              disabled={progress}
            />
          </div>
          <div>
            <label htmlFor="rpassword" className="sr-only">
              Repeat password
            </label>
            <input
              id="rpassword"
              name="rpassword"
              type="password"
              autoComplete="new-password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition disabled:bg-gray-100 disabled:cursor-wait"
              placeholder="Repeat password"
              disabled={progress}
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={progress}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:bg-indigo-400 disabled:hover:bg-indigo-500 disabled:cursor-wait"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  )
}

export default Page
