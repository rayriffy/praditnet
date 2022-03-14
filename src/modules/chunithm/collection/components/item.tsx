import { memo, MutableRefObject, useCallback, useMemo, useState } from 'react'

import { useRouter } from 'next/router'

import axios from 'axios'
import ReCAPTCHA from 'react-google-recaptcha'

import { Voice } from './voice'
import { Image } from '../../../../core/components/image'
import { classNames } from '../../../../core/services/classNames'
import { CollectionType } from '../constants/collectionTypes'
import { Trophy } from '../../home/components/trophy'

interface Props {
  collection: CollectionType
  isEquippable?: boolean
  item: {
    id: number
    name: string
    works?: string
    rarity?: number
  }
  capchaRef: MutableRefObject<ReCAPTCHA>
}

export const Item = memo<Props>(props => {
  const { item, collection, isEquippable = true, capchaRef } = props

  const [isProcess, setIsProcess] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)

  const isTrophy = useMemo(() => collection.id === 'trophy', [])

  const router = useRouter()

  const onSet = useCallback(async () => {
    setIsProcess(true)

    try {
      // make sure capcha is reset
      capchaRef.current.reset()

      // request for capcha token
      const token = await capchaRef.current!.executeAsync()

      // todo: create api to set item
      await axios.post(
        '/api/chunithm/collection/set',
        {
          type: collection.id,
          id: item.id,
        },
        {
          headers: {
            'X-PraditNET-Capcha': token,
          },
        }
      )
      router.push('/chunithm/collection')
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

  const isSmallLayout = useMemo(
    () => ['character', 'mapIcon'].includes(collection.id),
    []
  )

  return (
    <div
      className={classNames(
        !isSmallLayout ? 'flex-col-reverse' : '',
        'rounded-lg flex p-4 bg-gradient-to-r from-sky-100 to-blue-100 dark:bg-radial-at-r dark:from-sky-300 dark:to-blue-300'
      )}
    >
      {!isSmallLayout && (
        <div className="flex justify-between items-center">
          <div className="my-auto">
            {collection.id === 'systemVoice' && (
              <Voice systemVoiceId={item.id} />
            )}
          </div>
          {setButtonElement}
        </div>
      )}
      <div
        className={classNames(
          isTrophy ? 'my-2' : '',
          'shrink-0 flex items-center justify-center'
        )}
      >
        {isTrophy ? (
          <Trophy {...item} />
        ) : (
          <Image
            src={`https://praditnet-cdn.rayriffy.com/chunithm/${
              collection.assetPath ?? collection.id
            }/${item.id}.png`}
            className={classNames(
              isSmallLayout
                ? 'w-24 rounded overflow-hidden'
                : collection.id === 'systemVoice'
                ? 'w-52 mx-auto'
                : 'w-full',
              ['character', 'frame', 'mapIcon'].includes(collection.id)
                ? 'bg-gray-100'
                : ''
            )}
            {...collection.image}
          />
        )}
      </div>
      <div
        className={classNames(
          isSmallLayout ? 'pl-4' : 'mb-2',
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
        {isSmallLayout && setButtonElement}
      </div>
    </div>
  )
})
