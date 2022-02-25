import { GetServerSideProps, NextPage } from 'next'
import { Fragment } from 'react'

import { AppProps } from '../app/@types/AppProps'

interface Props {
  userData: {
    cardId: string
    chunkedCardId: string[]
  }
}

const Page: NextPage<Props> = props => {
  const { cardId, chunkedCardId } = props.userData

  return (
    <div>
      <div className="max-w-md mx-auto">
        <div className="w-full aspect-[3.37/2.125] bg-gradient-to-tr from-blue-50 to-gray-50 rounded-xl transition duration-300 hover:shadow-xl hover:shadow-blue-50 relative">
          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
            <p className="font-mono text-gray-700 text-lg sm:text-xl">
              {chunkedCardId.join(' ')}
            </p>
            <p className="font-mono text-gray-700 text-sm">Created at: 02/22</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { default: chunk } = await import('lodash/chunk')
  const { getApiUserSession } = await import(
    '../core/services/authentication/api/getApiUserSession'
  )

  // check for user session
  const user = await getApiUserSession(ctx.req)

  if (user === null || user === undefined) {
    return {
      redirect: {
        statusCode: 302,
        destination: '/login',
      },
    }
  }

  return {
    props: {
      userData: {
        cardId: user.card_luid,
        chunkedCardId: chunk(user.card_luid, 5).map(chunk => chunk.join('')),
      },
    },
  }
}

export default Page
