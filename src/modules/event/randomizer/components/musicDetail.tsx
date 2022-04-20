import { Fragment, memo } from 'react'

import { DifficultyBlock } from '../../../../core/components/difficultyBlock'

interface Props {
  event: {
    game: string
  }
  music: {
    id: number
    name: string
    artist: string
    level: number
    difficulty: 'master' | 'remaster'
  }
}

export const MusicDetail = memo<Props>(props => {
  const { event, music } = props

  return (
    <div className="bg-neutral-700 shadow border px-4 py-5 rounded-lg h-[386px] md:h-[382px] xl:h-[360px] pointer-events-none">
      <div className="flex justify-center">
        <div className="flex rounded-md overflow-hidden">
          <img
            src={`https://cdn.pradit.net/${event.game}/jacket/${music.id}.png`}
            className="w-full h-auto"
          />
        </div>
      </div>
      <div className="flex mt-4 md:mt-3">
        <DifficultyBlock difficulty={music.level} level={music.difficulty} />
      </div>
      <h1 className="font-semibold text-xl mt-2 leading-none truncate text-white">
        {music.name}
      </h1>
      <p className="text-gray-100 mt-0.5 text-sm">{music.artist}</p>
    </div>
  )
})
