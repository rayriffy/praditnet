import { memo } from 'react'
import { classNames } from '../../../../core/services/classNames'

export interface ChunithmMetadataProps {
  metadata?: {
    isClear: boolean
    isFullCombo: boolean
    isAllJustice: boolean
  }
}

export const ChunithmMetadata = memo<ChunithmMetadataProps>(props => {
  const {
    metadata = {
      isClear: false,
      isFullCombo: false,
      isAllJustice: false,
    },
  } = props

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
      <div
        className={classNames(
          metadata.isClear
            ? 'from-amber-400 to-yellow-400 text-gray-900'
            : 'from-gray-300 to-zinc-300 text-gray-600',
          'text-xs bg-gradient-to-b text-center rounded py-0.5 font-bold'
        )}
      >
        CLEAR
      </div>
      <div
        className={classNames(
          metadata.isFullCombo
            ? 'from-amber-400 to-yellow-400 text-gray-900'
            : 'from-gray-300 to-zinc-300 text-gray-600',
          'text-xs bg-gradient-to-b text-center rounded py-0.5 font-bold'
        )}
      >
        FULL COMBO
      </div>
      <div
        className={classNames(
          metadata.isAllJustice
            ? 'bg-gradient-to-r from-sky-300 via-rose-300 to-lime-300 text-black'
            : 'bg-gradient-to-b from-gray-300 to-zinc-300 text-gray-600',
          'text-xs text-center rounded py-0.5 font-bold'
        )}
      >
        ALL JUSTICE
      </div>
    </div>
  )
})
