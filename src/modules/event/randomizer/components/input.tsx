import { memo, useState } from 'react'
import { PoolButton } from './poolButton'

interface Props {
  pools: {
    id: string
    name: string
  }[]
  disabled?: boolean
  onRequest?(options: { pools: string[]; amount: number }): void
}

export const Input = memo<Props>(props => {
  const { pools, disabled = false, onRequest } = props

  const [error, setError] = useState<string>(null)

  const onSubmit = () => {
    setError(null)

    const amount = (
      document.querySelector('input#input-amount') as HTMLInputElement
    ).value
    const selectedPools = pools
      .filter(
        pool =>
          (
            document.querySelector(
              `input#input-pool-${pool.id}`
            ) as HTMLInputElement
          ).value === 'true'
      )
      .map(o => o.id)

    if (amount === '') {
      setError('Amount is required')
    } else if (!Number.isSafeInteger(Number(amount)) || Number(amount) <= 0) {
      setError('Amount must be an integer greater than 0')
    } else if (selectedPools.length === 0) {
      setError('At least one pool must be selected')
    } else {
      onRequest({
        amount: Number(amount),
        pools: selectedPools,
      })
    }
  }

  return (
    <div className="bg-white shadow rounded-lg border px-5 py-5">
      <h1 className="text-gray-900 text-xl font-bold">Input</h1>
      {error !== null && (
        <div className="bg-red-100 text-sm text-red-800 rounded-md px-5 py-4 mt-4">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-4">
        <div>
          <p className="block text-sm font-medium text-gray-700">Picked pool</p>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {pools.map(pool => (
              <PoolButton key={`pool-${pool.id}`} {...{ ...pool, disabled }} />
            ))}
          </div>
        </div>
        <div>
          <label
            htmlFor="input-amount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount
          </label>
          <div className="mt-1">
            <input
              type="number"
              inputMode="numeric"
              name="input-amount"
              id="input-amount"
              defaultValue={5}
              disabled={disabled}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100 disabled:cursor-wait"
              placeholder="5"
            />
          </div>
        </div>
        <div>
          <button
            type="button"
            onClick={onSubmit}
            disabled={disabled}
            className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-50 disabled:hover:bg-indigo-50 disabled:cursor-wait disabled:text-indigo-500"
          >
            Random!
          </button>
        </div>
      </div>
    </div>
  )
})
