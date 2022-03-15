import { Fragment, memo, MutableRefObject, useState } from 'react'

import dynamic from 'next/dynamic'

import ReCAPTCHA from 'react-google-recaptcha'

import { Image } from '../../../../core/components/image'
import { classNames } from '../../../../core/services/classNames'
import { GetDialogProps } from './getDialog'

const GetDialog = dynamic<GetDialogProps>(
  () => import('./getDialog').then(o => o.GetDialog),
  {
    ssr: false,
  }
)

interface Props {
  card: {
    id: number
    name: string
    serial: string
    owned: boolean
  }
  recaptchaRef: MutableRefObject<ReCAPTCHA>
}

export const Card = memo<Props>(props => {
  const { card, recaptchaRef } = props

  const [showGet, setShowGet] = useState(false)

  return (
    <button
      disabled={card.owned}
      onClick={() => {
        setShowGet(true)
      }}
      className="bg-slate-50 border rounded-md px-2 py-1"
    >
      <div className="relative">
        {!card.owned && (
          <Fragment>
            <div className="absolute top-1 bottom-1 left-1 right-1 z-[1] flex justify-center items-center">
              <img src="/assets/ongeki/lock.png" />
            </div>
            <div className="absolute bg-white top-1 bottom-1 left-1 right-1 z-[1] opacity-40" />
          </Fragment>
        )}
        <Image
          className={classNames(card.owned ? '' : 'grayscale')}
          src={`https://praditnet-cdn.rayriffy.com/ongeki/card/full/${card.id}.png`}
          width={384}
          height={526}
        />
      </div>
      <p className="text-xs text-center font-medium pb-1">{card.serial}</p>
      <GetDialog
        id={card.id}
        name={card.name}
        show={showGet}
        setShow={setShowGet}
        recaptchaRef={recaptchaRef}
      />
    </button>
  )
})
