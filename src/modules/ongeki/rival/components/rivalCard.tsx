import { memo, MutableRefObject, useState } from 'react'

import Link from 'next/link'
import dynamic from 'next/dynamic'

import { PlusIcon, TrashIcon } from '@heroicons/react/outline'

import { AddRivalProps } from './addRival'
import { DeleteRivalProps } from './deleteRival'
import { Image } from '../../../../core/components/image'

import { Rival } from '../@types/Rival'

interface Props {
  rival: Rival | undefined
  mode: 'add' | 'remove'
}

const DeleteRival = dynamic<DeleteRivalProps>(
  () => import('./deleteRival').then(o => o.DeleteRival),
  {
    ssr: false,
  }
)
const AddRival = dynamic<AddRivalProps>(
  () => import('./addRival').then(o => o.AddRival),
  {
    ssr: false,
  }
)

export const RivalCard = memo<Props>(props => {
  const { rival, mode = 'remove' } = props

  const [deleteDialog, setDeleteDialog] = useState(false)
  const [addDialog, setAddDialog] = useState(false)

  return rival ? (
    <div className="bg-gray-100 px-5 py-4 rounded-lg flex">
      <div className="shrink-0 flex items-center">
        <div className="bg-gray-50 border-2 border-gray-700 rounded-md overflow-hidden shadow aspect-square h-20">
          <Image
            src={`https://cdn.pradit.net/ongeki/card/icon/${rival.cardId}.png`}
            width={96}
            height={96}
          />
        </div>
      </div>
      <div className="ml-4 w-full flex justify-between">
        <div>
          <h1 className="font-semibold text-lg text-gray-900 mt-1.5">
            <span className="mr-2">
              Lv.<span className="text-lg">{rival.level}</span>
            </span>
            {rival.name}
          </h1>
          <p className="text-gray-700 text-sm">
            Rating {rival.rating.toFixed(2)}
          </p>
        </div>
        <div className="flex items-center">
          {mode === 'remove' ? (
            <button onClick={() => setDeleteDialog(o => !o)}>
              <TrashIcon className="w-8 h-8 text-gray-700" />
            </button>
          ) : (
            <button onClick={() => setAddDialog(o => !o)}>
              <PlusIcon className="w-8 h-8 text-gray-700" />
            </button>
          )}
        </div>
      </div>
      {mode === 'remove' ? (
        <DeleteRival
          rival={rival}
          show={deleteDialog}
          setShow={setDeleteDialog}
        />
      ) : (
        <AddRival rival={rival} show={addDialog} setShow={setAddDialog} />
      )}
    </div>
  ) : (
    <div className="h-24 border-2 border-dashed rounded-lg flex justify-center items-center">
      <Link href="/ongeki/rival/add">
        <a className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Add more rival
        </a>
      </Link>
    </div>
  )
})
