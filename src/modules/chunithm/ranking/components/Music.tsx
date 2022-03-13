import { AnchorHTMLAttributes, DetailedHTMLProps, memo } from 'react'

import Link from 'next/link'

import { classNames } from '../../../../core/services/classNames'

import { Difficulty } from '../@types/Difficulty'

interface Props
  extends DetailedHTMLProps<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  currentDifficulty: Difficulty
  music: {
    id: number
    name: string
    level: number
  }
}

export const Music = memo<Props>(props => {
  const { music, currentDifficulty, ...rest } = props

  return (
    <Link href={`/chunithm/ranking/${currentDifficulty.key}/${music.id}`}>
      <a
        className={classNames(
          currentDifficulty.color.secondary,
          currentDifficulty.color.border,
          'p-2 border-2 rounded-md flex justify-between space-x-2'
        )}
        {...rest}
      >
        <div className="w-full">
          <p
            className={classNames(
              currentDifficulty.color.primary,
              'uppercase text-sm font-extrabold text-white rounded px-2'
            )}
          >
            {currentDifficulty.name}
          </p>
          <p className="bg-neutral-800 text-white mt-1 rounded-md px-2 py-2">
            {music.name}
          </p>
        </div>
        <div className="shrink-0 border-2 border-neutral-800 rounded-md w-14 bg-white flex flex-col">
          <div className="uppercase text-xs bg-neutral-800 text-white py-0.5 text-center shrink-0">
            level
          </div>
          <div className="h-full flex justify-center items-center">
            {music.level}
          </div>
        </div>
      </a>
    </Link>
  )
})
