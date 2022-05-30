import { FormEventHandler, useState } from 'react'

import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'

import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

import { useTitle } from '../core/services/useTitle'
import { createApiInstance } from '../core/services/createApiInstance'
import {
  DatabaseIcon,
  ExclamationIcon,
  LinkIcon,
} from '@heroicons/react/outline'

interface Props {
  error?: string
}

const Page: NextPage<Props> = props => {
  if (props.error !== undefined) {
    return (
      <div className="mt-20 mb-4 flex justify-center items-center space-x-2">
        <ExclamationIcon className="w-10 h-10 text-gray-700" />
        <LinkIcon className="w-6 h-6 text-gray-700" />
        <DatabaseIcon className="w-10 h-10 text-gray-700" />
      </div>
    )
  }

  const [progress, setProgress] = useState<boolean>(false)
  const [error, setError] = useState<string>(null)

  const router = useRouter()
  const { executeRecaptcha } = useGoogleReCaptcha()

  useTitle('Login')

  const onSubmit: FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault()

    setProgress(true)
    setError(null)

    const body = {
      username: event.currentTarget.username.value,
      password: event.currentTarget.password.value,
    }

    try {
      const axios = await createApiInstance(executeRecaptcha('system/login'))

      const res = await axios.post('authentication/login', body)
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
      <h1 className="text-4xl font-bold text-gray-900">Login</h1>

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

          <div className="text-sm">
            Not having an account?{' '}
            <a
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Create one
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={progress}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:bg-indigo-400 disabled:hover:bg-indigo-500 disabled:cursor-wait"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  // attempts to connect to db
  const { createKnexInstance } = await import(
    '../core/services/createKnexInstance'
  )

  // perform simple query to check is server working
  try {
    const knex = createKnexInstance('praditnet')
    await knex('UserAuth').select('username').first()
    await knex.destroy()

    return {
      props: {},
    }
  } catch (e) {
    ctx.res.statusCode = 500
    return {
      props: {
        error: 'db-disconnected',
      },
    }
  }
}

export default Page
