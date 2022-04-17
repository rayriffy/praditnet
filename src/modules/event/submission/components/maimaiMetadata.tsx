import { memo } from 'react'

interface Props {
  musicId: number
}

const items = [
  {
    key: 'isClear',
    label: 'Clear',
  },
  {
    key: 'isFullCombo',
    label: 'Full Combo',
  },
  {
    key: 'isAllPerfect',
    label: 'All Perfect',
  },
]

export const MaimaiMetadata = memo<Props>(props => {
  const { musicId } = props

  return (
    <div className="flex flex-wrap">
      {items.map(item => (
        <div className="flex m-2" key={`music-metadata-${item.key}`}>
          <div className="flex items-center h-5">
            <input
              id={`music-${musicId}-${item.key}`}
              aria-describedby="comments-description"
              name={`music-${musicId}-${item.key}`}
              type="checkbox"
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label
              htmlFor={`music-${musicId}-${item.key}`}
              className="font-medium text-gray-700"
            >
              {item.label}
            </label>
          </div>
        </div>
      ))}
    </div>
  )
})
