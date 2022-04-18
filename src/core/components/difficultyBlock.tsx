import { memo } from 'react'
import { classNames } from '../services/classNames'

interface Props {
  difficulty: number
  level: string
  // | 'remaster'
  // | 'master'
  // | 'expert'
  // | 'advanced'
  // | 'basic'
  // | 'world's end'
  // | 'ultima'
  // | 'lunatic'
  // | 'utage'
}

export const DifficultyBlock = memo<Props>(props => {
  const { level, difficulty } = props

  return (
    <div
      className={classNames(
        level === 'remaster'
          ? 'bg-purple-200'
          : level === 'master'
          ? 'bg-purple-500'
          : level === 'expert'
          ? 'bg-red-500'
          : level === 'advanced'
          ? 'bg-orange-500'
          : level === 'basic'
          ? 'bg-emerald-500'
          : level === 'utage'
          ? 'bg-pink-500'
          : level === "world's end"
          ? 'bg-gradient-to-r from-sky-500 via-rose-500 to-lime-500'
          : level === 'ultima'
          ? 'bg-gradient-to-tr from-red-600 to-gray-900'
          : level === 'lunatic'
          ? 'bg-gradient-to-tr from-slate-50 to-neutral-50'
          : 'bg-white',
        level === 'remaster'
          ? 'text-purple-700'
          : level === 'lunatic'
          ? 'text-gray-900'
          : 'text-white',
        'px-2 py-1 text-xs uppercase rounded flex items-center'
      )}
    >
      <p>{level}</p>
      {!['utage', "world's end"].includes(level) && (
        <p
          className={classNames(
            level === 'remaster'
              ? 'bg-purple-500 text-white'
              : level === 'master'
              ? 'bg-purple-400'
              : level === 'expert'
              ? 'bg-red-400'
              : level === 'advanced'
              ? 'bg-orange-400'
              : level === 'basic'
              ? 'bg-emerald-400'
              : level === 'ultima'
              ? 'bg-gradient-to-tr from-red-500 to-gray-700'
              : level === 'lunatic'
              ? 'bg-gradient-to-t from-red-500 to-rose-800'
              : '',
            level === 'lunatic' ? 'text-white' : '',
            'text-sm mx-auto rounded text-center px-3 ml-2'
          )}
        >
          {Math.floor(difficulty)}
          {Number(difficulty.toFixed(1).split('.').reverse()[0]) >= 7
            ? '+'
            : ''}
        </p>
      )}
    </div>
  )
})
