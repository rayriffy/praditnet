import { memo } from 'react'
import { classNames } from '../../../../core/services/classNames'

interface Props {
  type: string
  item: {
    id: number
    name: string
    works?: string
  }
}

export const Item = memo<Props>(props => {
  const { item, type } = props

  return (
    <div
      className={classNames(
        type !== 'character' ? 'flex-col-reverse' : '',
        'rounded-lg flex p-4 bg-gradient-to-r from-sky-100 to-blue-100 dark:bg-radial-at-r dark:from-sky-300 dark:to-blue-300'
      )}
    >
      <div className="shrink-0 flex items-center">
        <img
          src={`https://praditnet-cdn.rayriffy.com/chunithm/${type}${
            ['character', 'systemVoice'].includes(type) ? '/icon' : ''
          }/${item.id}.png`}
          className={classNames(
            type === 'character'
              ? 'w-24 bg-gray-100 rounded overflow-hidden'
              : type === 'systemVoice'
              ? 'w-52 mx-auto'
              : 'w-full'
          )}
          loading="lazy"
        />
      </div>
      <div
        className={classNames(
          type === 'character' ? 'pl-4' : 'mb-2',
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
      </div>
    </div>
  )
})
