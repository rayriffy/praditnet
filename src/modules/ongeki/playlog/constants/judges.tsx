import { Fragment } from 'react'

export const judges = [
  {
    id: 'critical',
    name: (
      <Fragment>
        Critical
        <span className="hidden sm:inline-block">&nbsp;Break</span>
      </Fragment>
    ),
  },
  {
    id: 'break',
    name: 'Break',
  },
  {
    id: 'hit',
    name: 'Hit',
  },
  {
    id: 'miss',
    name: 'Miss',
  },
]
