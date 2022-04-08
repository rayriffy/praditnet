import { Fragment, memo, useState } from 'react'

import dynamic from 'next/dynamic'

import { EamuseCardProps } from './eamuseCard'

const EamuseCard = dynamic<EamuseCardProps>(() =>
  import('./eamuseCard').then(o => o.EamuseCard)
)

export interface EamuseTabProps {
  username: string
  cardId: string
  chunkedCardId: string[]
  createdAt: string | null
}

export const EamuseTab = memo<EamuseTabProps>(props => {
  const [open, setOpen] = useState(false)

  return (
    <Fragment>
      <EamuseCard {...props} />
      <div className="mt-8" />
    </Fragment>
  )
})
