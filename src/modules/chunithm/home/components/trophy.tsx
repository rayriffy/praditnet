import { memo, useMemo } from 'react'
import { classNames } from '../../../../core/services/classNames'

interface Props {
  id: number
  name: string
  rarity?: number
  size?: 'small' | 'medium' | 'large'
}

export const Trophy = memo<Props>(props => {
  const { name, rarity, size = 'small' } = props

  const color = useMemo(() => {
    switch (rarity) {
      case 0:
        return 'bg-white'
      case 1:
        return 'bg-orange-300'
      case 2:
        return 'bg-sky-200'
      case 3:
        return 'bg-yellow-300'
      case 4:
        return 'bg-yellow-300'
      case 5:
        return 'bg-yellow-200'
      case 6:
        return 'bg-yellow-200'
      case 7:
        return 'bg-gradient-to-r from-sky-200 via-rose-100 to-lime-200'
      default:
        return 'bg-white'
    }
  }, [rarity])

  const sizeClass = useMemo(() => {
    switch (size) {
      case 'small':
        return 'text-xs p-[0.0625rem]'
      case 'medium':
        return 'text-base p-0.5'
    }
  }, [size])

  return (
    <p
      className={classNames(
        color,
        sizeClass,
        'text-black w-full text-center rounded-md truncate'
      )}
    >
      {name}
    </p>
  )
})
