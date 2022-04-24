import { memo, useState } from 'react'

import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import NProgress from 'nprogress'

import { classNames } from '../../../../core/services/classNames'
import { createApiInstance } from '../../../../core/services/createApiInstance'

interface Props {
  cardId: number
  isKaika: boolean
}

export const Kaika = memo<Props>(props => {
  const { cardId, isKaika } = props

  const [progress, setProgress] = useState<boolean>(false)
  const { executeRecaptcha } = useGoogleReCaptcha()

  const onClick = async () => {
    setProgress(true)
    const axios = await createApiInstance(executeRecaptcha('ongeki/card/kaika'))

    try {
      await axios.post('ongeki/card/kaika', {
        id: cardId,
      })

      setProgress(false)

      NProgress.configure({ minimum: 0.3 })
      NProgress.start()

      window.location.reload()
    } catch (e) {
      setProgress(false)
    }
  }

  return (
    <button
      type="button"
      disabled={progress || isKaika}
      onClick={onClick}
      className={classNames(
        isKaika
          ? 'disabled:cursor-not-allowed'
          : progress
          ? 'disabled:cursor-wait'
          : '',
        'inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-100'
      )}
    >
      Kaika
    </button>
  )
})
