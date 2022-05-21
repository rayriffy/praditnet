import { memo } from 'react'

import { Image } from '../../../../core/components/image'

interface Props {
  event: {
    id: string
  }
  height: number
  onFlip(): void
}

export const BackCard = memo<Props>(props => {
  const { event, height, onFlip } = props

  return (
    <div
      onClick={onFlip}
      className="bg-neutral-700 shadow px-4 py-5 rounded-lg select-none flex justify-center items-center border-[10px] border-t-neutral-600 border-r-neutral-600 border-l-neutral-500 border-b-neutral-500"
      style={{
        height: `calc(${height}px + 14px)`,
      }}
    >
      <div className="flex w-48 pointer-events-none">
        <Image
          src={`https://cdn.pradit.net/event/${event.id}.png`}
          width={745}
          height={623}
        />
      </div>
    </div>
  )
})
