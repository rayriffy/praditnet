import { memo } from 'react'

import { Image } from '../../../../core/components/image'

interface Props {
  event: {
    id: string
  }
  height: number
}

export const BackCard = memo<Props>(props => {
  const { event, height } = props

  return (
    <div
      className="bg-neutral-700 shadow border px-4 py-5 rounded-lg select-none flex justify-center items-center pointer-events-none"
      style={{
        height: height,
      }}
    >
      <div className="flex w-60">
        <Image
          src={`https://cdn.pradit.net/event/${event.id}.png`}
          width={745}
          height={623}
        />
      </div>
    </div>
  )
})
