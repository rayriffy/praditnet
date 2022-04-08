import { PlusIcon } from '@heroicons/react/outline'
import dynamic from 'next/dynamic'
import { Fragment, memo, useState } from 'react'
import { BiTransfer } from 'react-icons/bi'
import { AimeCardProps } from './aimeCard'
import { AimeTransferDialogProps } from './aimeTransferDialog'

const AimeCard = dynamic<AimeCardProps>(() =>
  import('./aimeCard').then(o => o.AimeCard)
)

const AimeTransferDialog = dynamic<AimeTransferDialogProps>(
  () => import('./aimeTransferDialog').then(o => o.TransferDialog),
  { ssr: false }
)

export interface AimeTabProps {
  username: string
  cardId: string
  chunkedCardId: string[]
  createdAt: string | null
}

export const AimeTab = memo<AimeTabProps>(props => {
  const { cardId } = props

  const [open, setOpen] = useState(false)

  return (
    <Fragment>
      <AimeCard {...props} />
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="mt-8 inline-flex w-full justify-center relative items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <span className="absolute left-4 flex items-center top-0 bottom-0">
          {cardId !== null ? <BiTransfer /> : <PlusIcon className="w-4" />}
        </span>
        {cardId !== null ? 'Transfer card' : 'Bind card'}
      </button>
      <AimeTransferDialog show={open} setShow={setOpen} cardId={cardId} />
    </Fragment>
  )
})
