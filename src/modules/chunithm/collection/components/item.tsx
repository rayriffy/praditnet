import { memo, useCallback, useState } from 'react'

import { useRouter } from 'next/router'

import axios from 'axios'

import { Voice } from './voice'
import { Image } from '../../../../core/components/image'
import { classNames } from '../../../../core/services/classNames'
import { CollectionType } from '../constants/collectionTypes'

interface Props {
  collection: CollectionType
  isEquippable?: boolean
  item: {
    id: number
    name: string
    works?: string
  }
}

export const Item = memo<Props>(props => {
  const { item, collection, isEquippable = true } = props

  const [isProcess, setIsProcess] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)

  const router = useRouter()

  const onSet = useCallback(async () => {
    setIsProcess(true)

    try {
      // todo: create api to set item
      await axios.post('/api/chunithm/collection/set', {
        type: collection.id,
        id: item.id,
      })
      router.push('/chunithm/collection')
      // window.scrollTo({ top: 0, behavior: 'smooth' })
      // await wait(1000)
      // window.location.reload()
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
        {error
          ? 'Failed'
          : isProcess
          ? 'Working...'
          : isEquippable
          ? 'Set'
          : 'Locked'}
      </button>
    </div>
  )

  return (
    <div
      className={classNames(
        collection.id !== 'character' ? 'flex-col-reverse' : '',
        'rounded-lg flex p-4 bg-gradient-to-r from-sky-100 to-blue-100 dark:bg-radial-at-r dark:from-sky-300 dark:to-blue-300'
      )}
    >
      {collection.id !== 'character' && (
        <div className="flex justify-between items-center">
          <div className="my-auto">
            {collection.id === 'systemVoice' && (
              <Voice systemVoiceId={item.id} />
            )}
          </div>
          {setButtonElement}
        </div>
      )}
      <div className="shrink-0 flex items-center justify-center">
        <Image
          src={`https://praditnet-cdn.rayriffy.com/chunithm/${
            collection.assetPath ?? collection.id
          }/${item.id}.png`}
          className={classNames(
            collection.id === 'character'
              ? 'w-24 bg-gray-100 rounded overflow-hidden'
              : collection.id === 'systemVoice'
              ? 'w-52 mx-auto'
              : 'w-full'
          )}
          {...collection.image}
        />
      </div>
      <div
        className={classNames(
          collection.id === 'character' ? 'pl-4' : 'mb-2',
          'flex flex-col justify-between w-full'
        )}
      >
        <div>
          <h1 className="font-semibold">{item.name}</h1>
          {item.works !== null && (
            <p className="text-sm text-gray-500 dark:text-gray-700">
              {item.works}
            </p>
          )}
        </div>
        {collection.id === 'character' && setButtonElement}
      </div>
    </div>
  )
})
