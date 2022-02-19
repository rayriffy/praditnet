import { memo } from 'react'

import { UserPlaylog } from '../../home/@types/UserPlaylog'

interface Props {
  playlogs: UserPlaylog[]
}

export const PlaylogRenderer = memo<Props>(props => {
  const { playlogs } = props

  return (
    <div className="grid grid-cols-1 gap-6">
      {playlogs.map(playlog => (
        <div className="p-4 md:p-6 bg-gradient-to-r from-slate-100 to-gray-100 rounded-xl flex" key={`playlog-${playlog.id}`}>
          <img
            className="w-32 md:w-48 h-auto rounded"
            src={`https://praditnet-cdn.rayriffy.com/finale/jacket/${playlog.musicId}.png`}
            loading="lazy"
          />
          <div className="ml-6">
            <h1 className="font-bold text-2xl text-gray-900">
              {playlog.musicTitle}
            </h1>
            <p className="py-2 text-2xl md:text-4xl font-light">{playlog.achievement.toFixed(2)}%</p>
          </div>
        </div>
      ))}
    </div>
  )
})
