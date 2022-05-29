import { memo, useRef, useState } from 'react'
import { useSize } from 'web-api-hooks'

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
    difficulty: 'expert' | 'master' | 'remaster'
  }
}

export const RenderedMusic = memo<Props>(props => {
  const [flipped, setFlipped] = useState<boolean>(false)

  const ref = useRef<HTMLDivElement>(null)
  const [, height] = useSize(ref)

  return (
    <Flipper
      height={height}
      front={
        <BackCard
          onFlip={() => setFlipped(true)}
          height={height + 42}
          event={{ id: props.event.id }}
        />
      }
      back={
        <MusicDetail onFlip={() => setFlipped(false)} ref={ref} {...props} />
      }
      flipped={flipped}
      onFlip={flipped => setFlipped(flipped)}
    />
  )
})
