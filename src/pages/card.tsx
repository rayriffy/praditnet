import { GetServerSideProps, NextPage } from 'next'

import { AppProps } from '../app/@types/AppProps'

interface Props extends AppProps {}

const Page: NextPage = props => {
  return <>card</>
}

export const getServerSideProps: GetServerSideProps = async ctx => {
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
      user: {
        cardId: user.card_luid,
      },
    },
  }
}

export default Page
