import { memo } from 'react'
import { classNames } from '../../../../core/services/classNames'

interface Props {
  items: {
    key: string
    label: string
  }[]
  musicId: number
  disabled: boolean
  blocked: boolean
}

export const Metadata = memo<Props>(props => {
  const { musicId, disabled, blocked, items } = props

  return (
    <div className="flex flex-wrap">
      {items.map(item => (
        <div className="flex m-2" key={`music-metadata-${item.key}`}>
          <div className="flex items-center h-5">
            <input
              id={`music-${musicId}-${item.key}`}
              name={`music-${musicId}-${item.key}`}
              type="checkbox"
              disabled={disabled || blocked}
              className={classNames(
                blocked
                  ? 'disabled:cursor-not-allowed'
                  : 'disabled:cursor-wait',
                'focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded disabled:text-indigo-400 disabled:bg-gray-100'
              )}
            />
          </div>
          <div className="ml-3 text-sm">
            <label
              htmlFor={`music-${musicId}-${item.key}`}
              className="font-medium text-gray-700 dark:text-white"
            >
              {item.label}
            </label>
          </div>
        </div>
      ))}
    </div>
  )
})
