import { memo, useState } from 'react'
import { BackCard } from './backCard'

import { Flipper } from './flipper'
import { MusicDetail } from './musicDetail'

interface Props {
  event: {
    id: string
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

export const RenderedMusic = memo<Props>(props => {
  const [flipped, setFlipped] = useState<boolean>(false)

  return (
    <Flipper
      front={<BackCard event={{ id: props.event.id }} />}
      back={<MusicDetail {...props} />}
      flipped={flipped}
      onFlip={flipped => setFlipped(flipped)}
    />
  )
})
