import { Fragment, memo, useState } from 'react'
import { useEventListener } from 'web-api-hooks'
import { classNames } from '../../../../core/services/classNames'
import { RenderedMusic } from './renderedMusic'

interface Props {
  event: {
    id: string
    game: string
  }
  musics: {
    id: number
    name: string
    artist: string
    level: number
    difficulty: 'expert' | 'master' | 'remaster'
  }[]
}

export const MusicList = memo<Props>(props => {
  const { event, musics } = props

  const [overflow, setOverflow] = useState<boolean>(false)

  useEventListener(window, 'keydown', e => {
    if (e.code === 'Space') setOverflow(o => !o)
  })

  return (
    <Fragment>
      {overflow && (
        <div className="absolute top-4 left-4 px-4 py-3 rounded-md text-white bg-red-500 font-mono text-sm font-medium border-4 border-red-600">
          Overflow enabled
        </div>
      )}
      <div
        className={classNames(
          'sm:p-12 flex flex-wrap items-center w-full mx-auto justify-center h-screen',
          overflow ? '' : 'md:overflow-hidden'
        )}
      >
        {musics.map((music, i) => (
          <div className="mx-4 w-64 my-12">
            <RenderedMusic
              event={event}
              music={music}
              key={`randomized-${event.game}-${i}-${music.id}`}
            />
          </div>
        ))}
      </div>
    </Fragment>
  )
})
