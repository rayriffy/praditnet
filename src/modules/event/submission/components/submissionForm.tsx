import { memo, useEffect } from 'react'
import { Image } from '../../../../core/components/image'
import { MaimaiMetadata } from './maimaiMetadata'
import { Submission } from '../@types/Submission'

interface Props {
  eventId: string
  submission: Submission
  musics: {
    [key: string]: {
      id: number
      name: string
      artist: string
      level: string
      difficulty: number
    }[]
  }
}

export const SubmissionForm = memo<Props>(props => {
  const { musics, submission, eventId } = props

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-slate-100 to-gray-100 dark:from-neutral-700 dark:to-stone-700 rounded-md px-5 py-4 block sm:flex sm:justify-between">
        <div className="flex justify-between sm:justify-start space-x-0 sm:space-x-4">
          <img
            src={`/assets/logo/${submission.selectedGameId}.png`}
            className="w-40 h-auto"
          />
          <div className="flex items-center">
            <p className="py-1 px-6 font-semibold text-lg bg-gray-700 text-white rounded-md dark:bg-gray-100 dark:text-gray-900">
              {submission.inGameName}
            </p>
          </div>
        </div>
        <div className="flex items-center flex-row-reverse mt-2 justify-end sm:block">
          <div className="ml-2 sm:ml-0 flex sm:mt-2 justify-start sm:justify-center">
            <p className="bg-gray-700 text-white font-semibold text-lg rounded px-4 py-1 dark:bg-gray-100 dark:text-gray-900">
              {submission.remainingAttempts}
            </p>
          </div>
          <p className="dark:text-white">Remaining attempts</p>
        </div>
      </div>
      <div className="space-y-6">
        {musics[submission.selectedGameId].map(music => (
          <div
            className="bg-white shadow sm:rounded-lg border px-4 py-5 sm:p-6 flex flex-col sm:flex-row"
            key={`music-${submission.selectedGameId}-${music.id}`}
          >
            <div className="flex rounded-lg overflow-hidden shrink-0 mx-auto">
              <Image
                src={`https://cdn.pradit.net/${submission.selectedGameId}/jacket/${music.id}.png`}
                width={175}
                height={175}
              />
            </div>
            <div className="pl-0 pt-4 sm:pt-0 sm:pl-4 w-full">
              <h1 className="font-bold text-xl sm:text-2xl">{music.name}</h1>
              <div className="mt-0 sm:mt-2 w-full sm:w-3/5">
                <label
                  htmlFor={`music-${music.id}-score`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Score
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name={`music-${music.id}-score`}
                    id={`music-${music.id}-score`}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="mt-2">
                <MaimaiMetadata musicId={music.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})
