import { memo, useCallback, useState } from 'react'

import { useRouter } from 'next/router'

import axios from 'axios'

import { Image } from '../../../../core/components/image'
import { classNames } from '../../../../core/services/classNames'

interface Props {
  type: string
  isEquippable: boolean
  item: {
    id: number
    name: string
    description: string
    price: number
    genre: number
  }
}

export const Item = memo<Props>(props => {
  const { type, isEquippable, item } = props

  const [isProcess, setIsProcess] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)

  const router = useRouter()

  const onSet = useCallback(async () => {
    setIsProcess(true)

    try {
      // todo: create api to set item
      await axios.post('/api/finale/collection/set', {
        type,
        id: item.id,
      })
      router.push('/finale/collection')
    } catch (e) {
      setError(true)
      setTimeout(() => {
        setError(false)
      }, 2000)
    } finally {
      setIsProcess(false)
    }
  }, [])

  const setButtonElement = (
    <div className="flex justify-end mt-4">
      <button
        className={classNames(
          error
            ? 'from-rose-500 to-red-500 cursor-pointer'
            : isProcess
            ? 'from-sky-400 to-blue-400 animate-pulse cursor-wait'
            : isEquippable
            ? 'from-sky-500 to-blue-500 hover:from-sky-400 hover:to-blue-400 cursor-pointer'
            : 'from-slate-500 to-neutral-500 cursor-not-allowed',
          `text-white bg-gradient-to-r px-6 py-1 rounded-lg text-sm`
        )}
        disabled={isProcess || !isEquippable}
        onClick={onSet}
      >
        {error ? 'Failed' : isEquippable ? 'Set' : 'Locked'}
      </button>
    </div>
  )

  return (
    <div
      className={classNames(
        type !== 'icon' ? 'flex-col-reverse' : '',
        'rounded-lg flex p-4 bg-gradient-to-r from-sky-100 to-blue-100 dark:bg-radial-at-r dark:from-sky-300 dark:to-blue-300'
      )}
    >
      {type !== 'icon' && setButtonElement}
      <div className="shrink-0 flex items-center">
        <Image
          src={`https://praditnet-cdn.rayriffy.com/finale/${
            type === 'frame' ? 'frameMini' : type
          }/${item.id}.png`}
          className={classNames(type === 'icon' ? 'w-24' : 'w-full')}
          {...(type === 'frame'
            ? {
                width: 308,
                height: 128,
              }
            : type === 'icon'
            ? {
                width: 96,
                height: 96,
              }
            : {
                width: 284,
                height: 96,
              })}
        />
      </div>
      <div
        className={classNames(
          type === 'icon' ? 'pl-4' : 'mb-2',
          'flex flex-col justify-between w-full'
        )}
      >
        <div>
          <h1 className="font-semibold">{item.name}</h1>
          <div className="border-t-4 border-dotted border-gray-400 dark:border-gray-600 my-1"></div>
          <p className="text-sm text-gray-500 dark:text-gray-700">
            {item.description}
          </p>
        </div>
        {type === 'icon' && setButtonElement}
      </div>
    </div>
  )
})
