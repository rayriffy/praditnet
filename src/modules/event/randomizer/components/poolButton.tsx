import { memo, useState } from 'react'
import { classNames } from '../../../../core/services/classNames'

interface Props {
  id: string
  name: string
  disabled: boolean
}

export const PoolButton = memo<Props>(props => {
  const { id, name, disabled } = props

  const [selected, setSelected] = useState(false)

  return (
    <div>
      <input
        id={`input-pool-${id}`}
        type="hidden"
        value={selected.toString()}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => setSelected(o => !o)}
        className={classNames(
          selected
            ? 'text-white bg-indigo-600 hover:bg-indigo-700 border-transparent disabled:bg-indigo-400 disabled:hover:bg-indigo-500'
            : 'text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100',
          'w-full inline-flex justify-center items-center px-3 py-2 border text-sm leading-4 font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:cursor-wait'
        )}
      >
        {name}
      </button>
    </div>
  )
})
