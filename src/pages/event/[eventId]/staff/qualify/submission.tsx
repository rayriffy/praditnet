import { Fragment } from 'react'

import { GetServerSideProps, NextPage } from 'next'

const Page: NextPage = props => {
  return (
    <Fragment>
      <div className="flex -mt-6">
        <p className="uppercase bg-red-500 text-white px-2 py-0.5 text-sm rounded">
          Staff mode
        </p>
      </div>
      <div className="mt-6 space-y-4">
        <h1 className="text-2xl font-bold">Qualification submission</h1>

        <div className="bg-white shadow sm:rounded-lg border">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Identify
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Please type in identification ID of target user</p>
            </div>
            <div className="mt-5 sm:flex sm:items-center">
              <div className="w-full sm:max-w-xs">
                <label htmlFor="user-uid" className="sr-only">
                  User ID
                </label>
                <input
                  type="text"
                  name="user-uid"
                  id="user-uid"
                  maxLength={21}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md font-mono"
                  placeholder="zkER7fjeqx6hC5Q238nHi"
                />
              </div>
              <button className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const { createKnexInstance } = await import(
    '../../../../../core/services/createKnexInstance'
  )
  const { getApiUserSession } = await import(
    '../../../../../core/services/authentication/api/getApiUserSession'
  )
  const { getIsEventStaff } = await import(
    '../../../../../modules/event/home/services/getIsEventStaff'
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
