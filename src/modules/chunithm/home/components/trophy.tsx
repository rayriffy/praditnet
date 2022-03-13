import { memo, useMemo } from 'react'
import { classNames } from '../../../../core/services/classNames'

interface Props {
  id: number
  name: string
  rarity: number
}

export const Trophy = memo<Props>(props => {
  const { name, rarity } = props

  const color = useMemo(() => {
    switch (rarity) {
      case 1:
        return 'bg-gray-200'
      case 2:
        return 'bg-orange-300'
      case 3:
        return 'bg-sky-200'
      case 4:
        return 'bg-yellow-300'
      case 5:
        return 'bg-yellow-200'
      case 6:
        return 'bg-gradient-to-r from-sky-200 via-rose-100 to-lime-200'
      default:
        return 'bg-white'
    }
  }, [rarity])

  return (
    <p
      className={classNames(
        color,
        'text-gray-900 text-xs w-full text-center rounded-md p-[0.0625rem]'
      )}
    >
      {name}
    </p>
  )
})
