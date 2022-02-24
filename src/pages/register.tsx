import axios from 'axios'
import { FormEventHandler, useCallback, useState } from 'react'

import { NextPage } from 'next'
import { useRouter } from 'next/router'

const Page: NextPage = props => {
  const [error, setError] = useState<string>(null)

  const router = useRouter()

  const onSubmit: FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault()

    setError(null)

    const payload = {
      username: event.currentTarget.username.value,
      password: event.currentTarget.password.value,
    }

    if (payload.password !== event.currentTarget.rpassword.value) {
      setError(`The passwords don't match`)
      return
    }

    try {
      const res = await axios.post('/api/authentication/register', payload)

      if (res.status === 200) {
        router.push('/login')
      } else {
        throw new Error(res.data())
      }
    } catch (error) {
      console.error('An unexpected error happened occurred:', error)
      setError(error.message)
    }
  }

  return <div>Register</div>
}

export default Page
