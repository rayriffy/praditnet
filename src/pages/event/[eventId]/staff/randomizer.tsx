import { GetServerSideProps, NextPage } from 'next'

const Page: NextPage = props => {
  return <>OK</>
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const { createKnexInstance } = await import(
    '../../../../core/services/createKnexInstance'
  )
  const { getApiUserSession } = await import(
    '../../../../core/services/authentication/api/getApiUserSession'
  )
  const { getIsEventStaff } = await import(
    '../../../../modules/event/home/services/getIsEventStaff'
  )

  const eventId = ctx.params.eventId as string

  // check if auth
  const user = await getApiUserSession(ctx.req)
  if (user === null || user === undefined) {
    return {
      redirect: {
        statusCode: 302,
        destination: '/login',
      },
    }
  }

  const knex = createKnexInstance('praditnet')

  // if no event then 404
  const targetEvent = await knex('Event')
    .where({
      uid: eventId,
    })
    .first()
  if (targetEvent === undefined) {
    await knex.destroy()
    return {
      notFound: true,
    }
  }

  // check is staff, if not then redirect ro event
  const isStaff = await getIsEventStaff(eventId, knex, user.uid)
  if (!isStaff) {
    await knex.destroy()
    return {
      redirect: {
        statusCode: 302,
        destination: `/event/${eventId}`,
      },
    }
  }

  await knex.destroy()
  // permit to page
  return {
    props: {},
  }
}

export default Page
