import { memo, useCallback, useRef, Fragment } from 'react'

import { VolumeUpIcon } from '@heroicons/react/solid'

interface Props {
  systemVoiceId: number
}

export const Voice = memo<Props>(props => {
  const { systemVoiceId } = props

  const audioRef = useRef<HTMLAudioElement>(null)
  const onClick = useCallback(() => {
    if (!audioRef.current.paused) {
      audioRef.current.pause()
    }
    audioRef.current.currentTime = 0
    audioRef.current.play()
  }, [audioRef])

  return (
    <Fragment>
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        <VolumeUpIcon className="h-4 w-4" />
      </button>
      <audio
        ref={audioRef}
        src={`https://praditnet-cdn.rayriffy.com/chunithm/systemVoice/sample/${systemVoiceId}.mp3`}
      />
    </Fragment>
  )
})
