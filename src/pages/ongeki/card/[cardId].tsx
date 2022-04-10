import { GetServerSideProps, NextPage } from 'next'

interface Props {}

const Page: NextPage<Props> = props => {
  return <div className="mt-4">OK</div>
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { getApiUserSession } = await import(
    '../../../core/services/authentication/api/getApiUserSession'
  )

  const user = await getApiUserSession(ctx.req)

  if (user === null || user === undefined) {
    return {
      redirect: {
        statusCode: 302,
        destination: '/login',
      },
    }
  }

  // fetch user card

  return {
    props: {},
  }
}

export default Page
