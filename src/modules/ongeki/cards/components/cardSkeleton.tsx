import { memo } from 'react'

export const CardSkeleton = memo(() => {
  return (
    <div className="bg-slate-50 border rounded-md px-2 py-1 animate-pulse">
      <div className="p-1">
        <div className="aspect-[384/526] bg-gray-100 " />
      </div>
      <div className="text-xs text-center font-medium pb-1 bg-gray-600 select-none pointer-events-none mt-2.5 w-28 h-3 mx-auto rounded" />
    </div>
  )
})
